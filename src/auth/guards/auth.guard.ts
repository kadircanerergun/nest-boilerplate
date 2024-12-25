import { CanActivate, ExecutionContext } from '@nestjs/common';

interface AuthGuard extends CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
export { AuthGuard };
