import request from 'supertest';
import app from '../../../server';

describe('Signup Endpoint', () => {
  // Mock user data
  const data = {
    payload: {
      gstn: '33BCDEF1234G1HI',
      mail: {
        pri: 'someone@test.com',
      },
      pwd: 'securepassword',
    },
  };

  // Should register an account if not already exist.
  it('should create new account', async () => {
    const res = await request(app)
      .post('/s/api/account/signup')
      .send(data)
      .expect(200);
    expect(res.body.status).toBe(201);
  });

  // Should not create an account if an id already exist.
  it('should report duplicate id', async () => {
    const res = await request(app)
      .post('/s/api/account/signup')
      .send(data)
      .expect(200);
    expect(res.body.status).toBe(409);
  });
});
