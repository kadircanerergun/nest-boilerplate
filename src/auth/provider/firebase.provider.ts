import { BaseAuthProvider } from './base-auth.provider';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { ConfigService } from '@nestjs/config';
import { RegisterRequestDto, RegisterResponseDto } from '../dto/register.dto';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import firebaseConfig from './firebase.config';

class FirebaseProvider implements BaseAuthProvider {
  firebaseApp: any;
  constructor(configService: ConfigService) {
    if (admin.apps.length === 0) {
      const adminCredentials = admin.credential.cert(
        configService.get('FIREBASE_SERVICE_ACCOUNT') as admin.ServiceAccount,
      );
      admin.initializeApp({
        credential: adminCredentials,
      });
      this.firebaseApp = initializeApp(firebaseConfig);
    }
  }
  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const auth = getAuth(this.firebaseApp);
    const token = signInWithEmailAndPassword(auth, dto.email, dto.password);
    return {
      access_token: 'token',
      refresh_token: 'token',
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
}

export { FirebaseProvider };
