import { RegisterRequestDto } from '../dto/register.dto';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';

interface BaseAuthProvider {
  login(dto: LoginRequestDto): Promise<LoginResponseDto>;
  logout(): Promise<void>;
  register(dto: RegisterRequestDto): Promise<any | undefined>;
}

export { BaseAuthProvider };
