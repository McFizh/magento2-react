import { Model, Sequelize } from 'sequelize';

export class Category extends Model {
}

export const initCategory =  (sequelize: Sequelize): void => {
  Category.init({
  }, {
    sequelize,
    modelName: 'Category',
  });
};