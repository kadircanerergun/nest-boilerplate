import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../guards/firebase-auth.guard';

enum UserType {
  USER = 'user',
}
export function Auth(...userTypes: UserType[]) {
  return applyDecorators(
    SetMetadata('auth', true),
    SetMetadata('user_types', userTypes),
    UseGuards(FirebaseAuthGuard),
    ApiBearerAuth(),
  );
}
