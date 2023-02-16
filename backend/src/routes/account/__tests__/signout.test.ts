import request from 'supertest';
import app from '../../../server';

describe('Signout Endpoint', () => {
  // Should sign out an account.
  it('should sign out successfully', async () => {
    const setup = await request(app)
      .post('/s/api/account/signin')
      .send({payload: {_id: 'user@test.com', pwd: 'test@123'}})
      .expect(200);

    const cookie = setup.headers['set-cookie'];

    const res = await request(app)
      .delete('/s/api/account/signout')
      .set('Cookie', cookie)
      .expect(200);
    expect(res.body.status).toBe(200);
  });
});
