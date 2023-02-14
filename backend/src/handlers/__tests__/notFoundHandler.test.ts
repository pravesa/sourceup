import request from 'supertest';
import app from '../../server';

// Test suite for route not found middleware
describe('Route not found middleware', () => {
  // store the cookies here for accessing secure routes in later request
  let cookies = [''];

  // Sign in before accessing secure routes
  beforeAll(async () => {
    const res = await request(app)
      .post('/s/api/account/signin')
      .send({payload: {_id: 'user@test.com', pwd: 'test@123'}})
      .expect(200);
    cookies = res.headers['set-cookie'];
  });

  // Should send 404 response error for no matching route.
  it('should send 404 for no matching route', async () => {
    const res = await request(app)
      .get('/no-route')
      .set('Cookie', cookies)
      .expect(200);
    expect(res.body.status).toBe(404);
  });

  // Should pass the request call to matching route.
  it('should pass the request to matching route', async () => {
    const res = await request(app)
      .get('/s/api/verify-session')
      .set('Cookie', cookies)
      .expect(200);
    expect(res.body.payload._id).toBe('user@test.com');
  });
});
