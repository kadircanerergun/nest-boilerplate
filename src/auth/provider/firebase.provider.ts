import { AuthProvider } from './auth.provider';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { ConfigService } from '@nestjs/config';
import { RegisterRequestDto, RegisterResponseDto } from '../dto/register.dto';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { UnauthorizedException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
class FirebaseProvider implements AuthProvider {
  firebaseApp: any;
  constructor(private configService: ConfigService) {
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
    console.log('configFile', configFile);
    const configContent = fs.readFileSync(configFile, 'utf8');
    const configData = JSON.parse(configContent);

    this.firebaseApp = initializeApp(configData);
  }
}

export { FirebaseProvider };
