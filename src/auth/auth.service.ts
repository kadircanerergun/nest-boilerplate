import { Inject, Injectable } from '@nestjs/common';
import { AuthProvider } from './provider/auth.provider';
import { RegisterRequestDto } from './dto/register.dto';
import { LoginRequestDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AuthProvider') private readonly authProvider: AuthProvider,
  ) {}

  async register(dto: RegisterRequestDto) {
    return this.authProvider.register(dto);
  }

  async login(dto: LoginRequestDto) {
    return this.authProvider.login(dto);
  }
}
