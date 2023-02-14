import request from 'supertest';
import app from '../../../server';

describe('Signin Endpoint', () => {
  // Should not sign in if the account is not found.
  it('should report account not found', async () => {
    const res = await request(app)
      .post('/s/api/account/signin')
      .send({payload: {_id: 'noone@test.com', pwd: 'securepassword'}})
      .expect(200);
    expect(res.body.status).toBe(404);
  });

  // Should not sign in if incorrect password is provided.
  it('should report incorrect password', async () => {
    const res = await request(app)
      .post('/s/api/account/signin')
      .send({payload: {_id: 'user@test.com', pwd: 'password'}})
      .expect(200);
    expect(res.body.status).toBe(401);
  });

  // Should sign in if an account already exist.
  it('should sign in successfully', async () => {
    const res = await request(app)
      .post('/s/api/account/signin')
      .send({payload: {_id: 'user@test.com', pwd: 'test@123'}})
      .expect(200);
    expect(res.body.status).toBe(200);
  });
});
