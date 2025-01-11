export type DatabaseType = 'postgres' | 'mongodb';

export interface PostgresOptions {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export interface MongoDBOptions {
  type: 'mongodb';
  uri: string;
}

export type DatabaseOptions = PostgresOptions | MongoDBOptions;
