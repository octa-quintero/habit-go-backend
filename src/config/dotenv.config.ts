import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  DB_PORT: process.env.DB_PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_MIGRATE_DATA: process.env.DB_MIGRATE_DATA === 'true' || false,
};

export default config;
