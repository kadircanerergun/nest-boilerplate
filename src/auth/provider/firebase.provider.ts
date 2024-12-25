import { AuthProvider } from './auth.provider';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { ConfigService } from '@nestjs/config';
import { RegisterRequestDto, RegisterResponseDto } from '../dto/register.dto';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ExtendedRequest } from '../types/extended-request';
import { AuthUserDto } from '../dto/auth-user.dto';
import { Reflector } from '@nestjs/core';

class FirebaseProvider implements AuthProvider {
  firebaseApp: any;
  constructor(private readonly configService: ConfigService) {
    if (admin.apps.length === 0) {
      const adminCredentials = admin.credential.cert(
        configService.getOrThrow(
          'FIREBASE_SERVICE_ACCOUNT',
        ) as admin.ServiceAccount,
      );
      admin.initializeApp({
        credential: adminCredentials,
      });
      this.initializeClientApp(configService);
    }
  }
  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const auth = getAuth(this.firebaseApp);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      dto.email,
      dto.password,
    ).catch(() => {
      throw new UnauthorizedException('Invalid credentials');
    });

    const token = await userCredential.user.getIdTokenResult();

    return {
      access_token: token.token,
      expires_in: new Date(token.expirationTime).getTime(),
    };
  }
  logout(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async register(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    return await admin.app().auth().createUser({
      email: dto.email,
      password: dto.password,
      displayName: dto.name_surname,
    });
  }

  private initializeClientApp(config: ConfigService) {
    const configFile = path.resolve(
      __dirname,
      config.getOrThrow('FIREBASE_CONFIG_FILE'),
    );
    const configContent = fs.readFileSync(configFile, 'utf8');
    const configData = JSON.parse(configContent);

    this.firebaseApp = initializeApp(configData);
  }

  async canActivate(
    reflector: Reflector,
    context: ExecutionContext,
  ): Promise<boolean> {
    const isFirebaseAuth =
      reflector.get<boolean>('auth-protected', context.getHandler()) ?? false;

    if (!isFirebaseAuth) {
      return true; // If no metadata, allow access
    }

    const request = context.switchToHttp().getRequest() as ExtendedRequest;
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authentication token',
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const tokenResult = await admin.auth().verifyIdToken(token);
      if (tokenResult?.exp * 1000 < Date.now()) {
        return false;
      }
      request.user = new AuthUserDto({
        email: tokenResult.email,
        id: tokenResult.uid,
        name_surname: tokenResult.name,
      });
      return true; // Allow access
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

export { FirebaseProvider };
