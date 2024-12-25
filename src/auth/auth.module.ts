import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseProvider } from './provider/firebase.provider';
import { AuthProvider } from './provider/auth.provider';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthConfig } from './auth.config';

@Module({})
export class AuthModule {
  static forRoot(config: AuthConfig): DynamicModule {
    const authProvider = {
      provide: 'AuthProvider', // This is the token we are injecting
      useFactory: (configService: ConfigService) => {
        if (config.provider) {
          return new FirebaseProvider(configService);
        } else {
          throw new Error('Invalid authentication provider');
        }
      },
      inject: [ConfigService],
    };

    return {
      module: AuthModule,
      providers: [authProvider, AuthService],
      controllers: [AuthController],
      exports: [authProvider, AuthService],
    };
  }
}
