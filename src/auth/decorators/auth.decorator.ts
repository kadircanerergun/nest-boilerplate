import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

enum UserType {
  USER = 'user',
}
export function Auth(...userTypes: UserType[]) {
  return applyDecorators(
    SetMetadata('auth-protected', true),
    SetMetadata('user_types', userTypes),
    UseGuards(AuthGuard),
    ApiBearerAuth(),
  );
}
