import request from 'supertest'; 
import app from '../../app'; 
import sequelize from '../database'; 
import User from '../models/user.model'; 

beforeAll(async () => {
  // Ensure the database is synced before running tests
  await sequelize.sync({ force: true }); // This will recreate the tables
});

afterAll(async () => {
  // Close the database connection after all tests are done
  await sequelize.close();
});

describe('User Controller Tests', () => {
  test('POST /users should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        username: 'testuser',
        password: 'testpassword',
        deposit: 100,
        role: 'buyer',
      });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe('testuser');
  });

  test('GET /users should return a list of users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });


});



