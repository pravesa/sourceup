import request from 'supertest';
import app from '../../server';

// Test suite for authenticate session and get session middleware
describe('Authenticate session and get session middleware', () => {
  // Should not allow request to secure routes if user session doesn't exist.
  it('should send unauthorized error response', async () => {
    const res = await request(app).get('/s/api/verify-session').expect(200);
    expect(res.body.status).toBe(401);
  });

  // Should allow request to secure routes if user session exist
  it('should call the next middleware', async () => {
    // Sign in before accessing secure routes
    const user = await request(app)
      .post('/s/api/account/signin')
      .send({payload: {_id: 'user@test.com', pwd: 'test@123'}})
      .expect(200);
    expect(user.body.status).toBe(200);

    // Access secure route after setting session cookie
    const res = await request(app)
      .get('/s/api/verify-session')
      .set('Cookie', user.headers['set-cookie'])
      .expect(200);
    expect(res.body.status).toBe(200);
    expect(res.body.payload._id).toBe('user@test.com');
  });
});
