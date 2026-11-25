import { registerAs } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envSchema } from './env.config.js';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const env = envSchema.parse(process.env);

  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    autoLoadEntities: true,
    synchronize: env.DB_SYNC,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  };
});