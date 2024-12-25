import { RegisterRequestDto } from '../dto/register.dto';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';
import { Reflector } from '@nestjs/core';

interface AuthProvider {
  login(dto: LoginRequestDto): Promise<LoginResponseDto>;
  logout(): Promise<void>;
  register(dto: RegisterRequestDto): Promise<any | undefined>;
  canActivate(reflector: Reflector, context: any): boolean | Promise<boolean>;
}

export { AuthProvider };
