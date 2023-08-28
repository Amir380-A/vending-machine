import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public deposit!: number;
  public role!: string;
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deposit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'buyer', // Default role is 'buyer'
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;
