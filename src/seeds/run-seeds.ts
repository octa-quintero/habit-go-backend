import { DataSource } from 'typeorm';
import { seedRewards } from './rewards.seed';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'habit_go',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
});

async function runSeeds() {
  try {
    console.log('🌱 Iniciando seeds...');

    await AppDataSource.initialize();
    console.log('✅ Conexión a base de datos establecida');

    await seedRewards(AppDataSource);

    console.log('✅ Seeds completadas exitosamente');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

runSeeds();
