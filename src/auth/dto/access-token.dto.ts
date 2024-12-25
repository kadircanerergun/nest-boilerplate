import { ApiProperty } from '@nestjs/swagger';

class AccessTokenDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

export { AccessTokenDto };
