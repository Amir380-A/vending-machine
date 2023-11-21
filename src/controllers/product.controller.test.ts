import request from 'supertest';
import app from '../../app'; 
import sequelize from '../database'; 
import Product from '../models/product.model'; 

beforeAll(async () => {
 
  await sequelize.sync({ force: true }); // This will recreate the tables
});

afterAll(async () => {
  // Close the database connection after all tests are done
  await sequelize.close();
});

describe('Product Controller Tests', () => {
  let productId: number;

  test('POST /products should create a new product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        amountAvailable: 10,
        cost: 5,
        productName: 'Test Product',
        sellerId: 1, // Ensure this sellerId exists in your database
      });

    expect(response.status).toBe(201);
    expect(response.body.productName).toBe('Test Product');
    productId = response.body.id; // Store the product ID for future tests
  });

  test('GET /products should return a list of products', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /products/:id should return a specific product', async () => {
    const response = await request(app).get(`/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
  });

  test('PUT /products/:id should update a product', async () => {
    const updatedProductData = {
      amountAvailable: 20,
      cost: 10,
      productName: 'Updated Product',
    };

    const response = await request(app)
      .put(`/products/${productId}`)
      .send(updatedProductData);

    expect(response.status).toBe(200);
    expect(response.body.productName).toBe('Updated Product');
  });

  test('DELETE /products/:id should delete a product', async () => {
    const response = await request(app).delete(`/products/${productId}`);

    expect(response.status).toBe(204);
  });


});




