import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

enum UserType {
  USER = 'user',
}

class AuthUserDto {
  @ApiProperty()
  @IsString()
  id: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  name_surname: string;
  @ApiProperty({ enum: UserType })
  type?: UserType = UserType.USER;

  constructor(partial: Partial<AuthUserDto>) {
    Object.assign(this, partial);
  }
}
export { AuthUserDto };
