import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  PORT: process.env.PORT || '3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT
  JWT_SECRET:
    process.env.JWT_SECRET || 'default-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // Database
  DB_PORT: process.env.DB_PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_MIGRATE_DATA: process.env.DB_MIGRATE_DATA === 'true' || false,

  // Email (optional)
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Habit Go',

  // Security (optional)
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
  LOGIN_BLOCK_TIME: parseInt(process.env.LOGIN_BLOCK_TIME || '15', 10),

  // Logging (optional)
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
};

export default config;
