import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAuthProvider } from './provider/base-auth.provider';
import { FirebaseProvider } from './provider/firebase.provider';
import { RegisterRequestDto } from './dto/register.dto';
import { LoginRequestDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private authProvider: BaseAuthProvider;
  constructor(private readonly configService: ConfigService) {
    const providerConfig = this.configService.get('AUTH_PROVIDER', 'firebase');
    this.initProvider(providerConfig);
  }

  initProvider(provider: string) {
    switch (provider) {
      case 'firebase':
        this.authProvider = new FirebaseProvider(this.configService);
        break;
      default:
        throw new Error('Invalid provider');
    }
  }

  async register(dto: RegisterRequestDto) {
    return this.authProvider.register(dto);
  }

  async login(dto: LoginRequestDto) {
    return this.authProvider.login(dto);
  }
}
