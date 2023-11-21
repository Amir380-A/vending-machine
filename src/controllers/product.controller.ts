import { Request, Response } from 'express';
import Product from '../models/product.model';
import logger from '../middlewares/logger';

class ProductController {
  // Create a new product
  static async createProduct(req: Request, res: Response) {
    try {
      const { amountAvailable, cost, productName, sellerId } = req.body;
      const product = await Product.create({ amountAvailable, cost, productName, sellerId });
      res.status(201).json(product);
    } catch (error) {
      logger.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get all products
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (error) {
      logger.error('Error getting all products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get a specific product by ID
  static async getProductById(req: Request, res: Response) {
    const productId = Number(req.params.id);

    try {
      const product = await Product.findByPk(productId);
      if (product) {
        res.status(200).json(product);
      } else {
        logger.error('Product not found with ID:', productId);
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      logger.error('Error getting product by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Update a product's information
  static async updateProduct(req: Request, res: Response) {
    const productId = Number(req.params.id);
    const { amountAvailable, cost, productName, sellerId } = req.body;

    try {
      const product = await Product.findByPk(productId);
      if (product) {
        product.amountAvailable = amountAvailable;
        product.cost = cost;
        product.productName = productName;
        product.sellerId = sellerId;
        await product.save();
        res.status(200).json(product);
      } else {
        logger.error('Product not found with ID:', productId);
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      logger.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Delete a product
  static async deleteProduct(req: Request, res: Response) {
    const productId = Number(req.params.id);

    try {
      const product = await Product.findByPk(productId);
      if (product) {
        await product.destroy();
        res.status(204).send();
      } else {
        logger.error('Product not found with ID:', productId);
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      logger.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  static async buyProduct(req: Request, res: Response) {
    const productId = Number(req.params.id);
    const { amount } = req.body;
    const userId = Number(req.user.id); // Assuming you have authenticated the user

    try {
      // Find the product by ID
      const product = await Product.findByPk(productId);

      if (!product) {
        logger.error('Product not found with ID:', productId);
        return res.status(404).json({ error: 'Product not found' });
      }

      // Find the user by ID
      const user = await User.findByPk(userId);

      if (!user) {
        logger.error('User not found with ID:', userId);
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate the total cost
      const totalCost = product.cost * amount;

      // Check if the user has enough deposit
      if (user.deposit < totalCost) {
        logger.error('Insufficient funds for the purchase');
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Deduct the cost from the user's deposit
      user.deposit -= totalCost;
      await user.save();

      // Update the amount available for the product
      product.amountAvailable -= amount;
      await product.save();

      res.status(200).json({
        message: 'Purchase successful',
        productsPurchased: {
          productId: product.id,
          amountPurchased: amount,
        },
        remainingDeposit: user.deposit,
      });
    } catch (error) {
      logger.error('Error buying product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default ProductController;