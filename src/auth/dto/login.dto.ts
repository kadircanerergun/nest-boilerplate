import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccessTokenDto } from './access-token.dto';

class LoginRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

class LoginResponseDto extends AccessTokenDto {}

export { LoginRequestDto, LoginResponseDto };
