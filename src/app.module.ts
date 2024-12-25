import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LlmModule } from './llm/llm.module';
import { AUTH_PROVIDERS } from './auth/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LlmModule,
    AuthModule.forRoot({
      provider: AUTH_PROVIDERS.FIREBASE,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
