import 'reflect-metadata';
import {DataSource} from 'typeorm';

import User from './entity/user';
import Token from './entity/token';

require('dotenv').config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Token],
  synchronize: false,
  logging: false,
  migrations: ['src/migration/*.ts'],
  subscribers: [],
});
