import { ApiProperty } from '@nestjs/swagger';

class AccessTokenDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expires_in: number;
}

export { AccessTokenDto };
