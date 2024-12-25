import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth.service';
import { ExtendedRequest } from '../types/extended-request';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class FirebaseAuthGuard implements AuthGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isFirebaseAuth =
      this.reflector.get<boolean>('auth', context.getHandler()) ?? false;

    if (!isFirebaseAuth) {
      return true; // If no metadata, allow access
    }

    const request = context.switchToHttp().getRequest() as ExtendedRequest;
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authentication token',
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const tokenResult = await admin.auth().verifyIdToken(token);
      if (tokenResult?.exp * 1000 < Date.now()) {
        throw new UnauthorizedException('Token expired');
      }
      request.user = new AuthUserDto({
        email: tokenResult.email,
        id: tokenResult.uid,
        name_surname: tokenResult.name,
      });
      return true; // Allow access
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
