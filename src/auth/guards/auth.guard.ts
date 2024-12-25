import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthProvider } from '../provider/auth.provider';

class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AuthProvider') private readonly authProvider: AuthProvider,
  ) {}
  canActivate(context: ExecutionContext) {
    return this.authProvider.canActivate(this.reflector, context);
  }
}
export { AuthGuard };
