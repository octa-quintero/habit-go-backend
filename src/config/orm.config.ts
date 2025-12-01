import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'module/users/entities/user.entity';
import { Habit } from 'module/habits/entities/habit.entity';
import { HabitRegister } from 'module/habit-register/entities/habit-register.entity';
import dotenvoption from './dotenv.config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: parseInt(dotenvoption.DB_PORT || '5432', 10),
  host: dotenvoption.DB_HOST,
  username: dotenvoption.DB_USERNAME,
  password: dotenvoption.DB_PASSWORD,
  database: dotenvoption.DB_NAME,
  dropSchema: dotenvoption.DB_MIGRATE_DATA,
  synchronize: true,
  logging: false,
  entities: [User, Habit, HabitRegister],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
