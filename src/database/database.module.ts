import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseOptions, DatabaseType } from './database.types';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class DatabaseModule {
  static forRootAsync(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          inject: [ConfigService],
          useFactory: async (
            configService: ConfigService,
          ): Promise<DatabaseOptions> => {
            const dbType = configService.get<DatabaseType>('DB_TYPE');

            if (dbType === 'postgres') {
              return {
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
              };
            }

            if (dbType === 'mongodb') {
              return {
                type: 'mongodb',
                uri: configService.get<string>('MONGODB_URI'),
              };
            }

            throw new Error(`Unsupported database type: ${dbType}`);
          },
        },
      ],
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          inject: ['DATABASE_OPTIONS'],
          useFactory: async (options: DatabaseOptions) => {
            if (options.type === 'postgres') {
              return {
                type: 'postgres',
                host: options.host,
                port: options.port,
                username: options.username,
                password: options.password,
                database: options.database,
                synchronize: options.synchronize,
                autoLoadEntities: true,
              };
            }
            return null;
          },
        }),
        MongooseModule.forRootAsync({
          inject: ['DATABASE_OPTIONS'],
          useFactory: async (options: DatabaseOptions) => {
            if (options.type === 'mongodb') {
              return { uri: options.uri };
            }
            return null;
          },
        }),
      ],
    };
  }
}
