import request from 'supertest';
import app from '../../../server';

const mockProfile = {
  name: 'test',
  mail: {
    sec: 'user2@test.com',
  },
  regd: {
    bno: '101/2',
    city: 'chennai',
    state: 'Tamil Nadu',
    country: 'India',
  },
};

describe('Profile Endpoint', () => {
  // Should not update profile if user session is not found.
  it('should report Unauthorized access', async () => {
    const res = await request(app)
      .post('/s/api/settings/profile')
      .send({payload: mockProfile})
      .expect(200);
    expect(res.body.status).toBe(401);
  });

  // Should update the user profile.
  it('should update user profile', async () => {
    const setup = await request(app)
      .post('/s/api/account/signin')
      .send({payload: {_id: 'user@test.com', pwd: 'test@123'}})
      .expect(200);

    const cookie = setup.headers['set-cookie'];

    const res = await request(app)
      .post('/s/api/settings/profile')
      .set('Cookie', cookie)
      .send({payload: mockProfile})
      .expect(200);
    expect(res.body.status).toBe(200);
  });
});
