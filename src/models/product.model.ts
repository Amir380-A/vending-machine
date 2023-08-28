import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Product extends Model {
  public id!: number;
  public amountAvailable!: number;
  public cost!: number;
  public productName!: string;
  public sellerId!: number;
}

Product.init(
  {
    amountAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
  }
);

export default Product;
