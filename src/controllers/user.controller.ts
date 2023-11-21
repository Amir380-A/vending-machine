import { Request, Response } from 'express';
import User from '../models/user.model';
import logger from '../middlewares/logger';

class UserController {
  // Create a new user
  static async createUser(req: Request, res: Response) {
    try {
      const { username, password, deposit, role } = req.body;
      const user = await User.create({ username, password, deposit, role });
      res.status(201).json(user);
    } catch (error) {
      logger.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get all users
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      logger.error('Error getting all users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get a specific user by ID
  static async getUserById(req: Request, res: Response) {
    const userId = Number(req.params.id);

    try {
      const user = await User.findByPk(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        logger.error('User not found with ID:', userId);
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Update a user's information
  static async updateUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const { username, password, deposit, role } = req.body;

    try {
      const user = await User.findByPk(userId);
      if (user) {
        user.username = username;
        user.password = password;
        user.deposit = deposit;
        user.role = role;
        await user.save();
        res.status(200).json(user);
      } else {
        logger.error('User not found with ID:', userId);
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Delete a user
  static async deleteUser(req: Request, res: Response) {
    const userId = Number(req.params.id);

    try {
      const user = await User.findByPk(userId);
      if (user) {
        await user.destroy();
        res.status(204).send();
      } else {
        logger.error('User not found with ID:', userId);
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  static async deposit(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const { amount } = req.body;

    try {
      const user = await User.findByPk(userId);

      if (user) {
        user.deposit += amount;
        await user.save();
        res.status(200).json({ message: 'Deposit successful', deposit: user.deposit });
      } else {
        logger.error('User not found with ID:', userId);
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error('Error depositing coins:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Reset a user's deposit to zero
  static async resetDeposit(req: Request, res: Response) {
    const userId = Number(req.params.id);

    try {
      const user = await User.findByPk(userId);

      if (user) {
        user.deposit = 0;
        await user.save();
        res.status(200).json({ message: 'Deposit reset successful', deposit: user.deposit });
      } else {
        logger.error('User not found with ID:', userId);
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error('Error resetting deposit:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}


export default UserController;
