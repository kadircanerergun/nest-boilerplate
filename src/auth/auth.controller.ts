import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RegisterRequestDto } from './dto/register.dto';
import { Auth } from './decorators';
import { ExtendedRequest } from './types/extended-request';
import { AuthUserDto } from './dto/auth-user.dto';

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

  @Get()
  @Auth()
  @ApiOkResponse({ description: 'Hello World', type: AuthUserDto })
  getHello(@Req() req: ExtendedRequest): AuthUserDto {
    const user = req['user'];
    return user;
  }
}
