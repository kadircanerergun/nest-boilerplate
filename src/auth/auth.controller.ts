import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RegisterRequestDto } from './dto/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Access token object', type: LoginResponseDto })
  async login(@Body() body: LoginRequestDto) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'User created successfully',
  })
  async register(@Body() body: RegisterRequestDto) {
    return this.authService.register(body);
  }
}
