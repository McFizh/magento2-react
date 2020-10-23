import { Sequelize } from 'sequelize';

const DBConfig = require('../../config/config.js');

import { Category, initCategory } from '../models/Category';

const env = process.env.NODE_ENV || 'development';
export const sequelize = new Sequelize(DBConfig[env].url, DBConfig[env]);

export const initDb = (): void => {
  initCategory(sequelize);
};

export const closeDb = (): void => {
  sequelize.close();
};

export const clearDb = async (): Promise<void> => {
  await Category.truncate({ cascade: true });
};