import { AuthUserDto } from '../dto/auth-user.dto';

type ExtendedRequest = Request & {
  user: AuthUserDto;
};

export { ExtendedRequest };
