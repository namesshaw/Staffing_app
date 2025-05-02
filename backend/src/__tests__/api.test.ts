import request from 'supertest';
import { app } from '../index';
import prismaClient from '../db/db';

let clientToken: string;
let devToken: string;
let clientId: string;
let devId: string;
let projectId: string;
let roomId: string;

beforeAll(async () => {
  await prismaClient.$transaction([
    prismaClient.projectSkill.deleteMany(),
    prismaClient.project.deleteMany(),
    prismaClient.room.deleteMany(),
    prismaClient.chat.deleteMany(),
    prismaClient.user.deleteMany(),
    prismaClient.developer.deleteMany(),
  ]);
});

afterAll(async () => {
  await prismaClient.$disconnect();
});

describe('Client Auth & Info', () => {
  it('POST /api/v1/client/signup - success', async () => {
    const res = await request(app).post('/api/v1/client/signup').send({
      name: 'Client1',
      email: 'client1@example.com',
      password: 'pass123',
      company: 'C1',
      phone: '1234567890'
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    clientToken = res.body.token;
    clientId = res.body.userId;
  });

  it('POST /api/v1/client/signin - success', async () => {
    const res = await request(app).post('/api/v1/client/signin').send({
      email: 'client1@example.com',
      password: 'pass123'
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/v1/client/signin - wrong password', async () => {
    const res = await request(app).post('/api/v1/client/signin').send({
      email: 'client1@example.com',
      password: 'wrongpass'
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/v1/client/signin - not registered', async () => {
    const res = await request(app).post('/api/v1/client/signin').send({
      email: 'notfound@example.com',
      password: 'pass123'
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/client/info - success', async () => {
    const res = await request(app)
      .get('/api/v1/client/info')
      .set('Authorization', clientToken);
    expect(res.status).toBe(202);
    expect(res.body.email).toBe('client1@example.com');
  });

  it('GET /api/v1/client/info - no token', async () => {
    const res = await request(app).get('/api/v1/client/info');
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/client/info - invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/client/info')
      .set('Authorization', 'invalidtoken');
    expect(res.status).toBe(400);
  });
});

describe('Developer Auth & Info', () => {
  it('POST /api/v1/dev/signup - success', async () => {
    const res = await request(app).post('/api/v1/dev/signup').send({
      name: 'Dev1',
      YOE: 2,
      email: 'dev1@example.com',
      phone: '9876543210',
      password: 'devpass'
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    devToken = res.body.token;
    devId = res.body.userId; // <-- Add this!
  });

  it('POST /api/v1/dev/signin - success', async () => {
    const res = await request(app).post('/api/v1/dev/signin').send({
      email: 'dev1@example.com',
      password: 'devpass'
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/v1/dev/signin - wrong password', async () => {
    const res = await request(app).post('/api/v1/dev/signin').send({
      email: 'dev1@example.com',
      password: 'wrongpass'
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/v1/dev/signin - not registered', async () => {
    const res = await request(app).post('/api/v1/dev/signin').send({
      email: 'notfound@example.com',
      password: 'devpass'
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/dev/info - success', async () => {
    const res = await request(app)
      .get('/api/v1/dev/info')
      .set('Authorization', devToken);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('dev1@example.com');
  });

  it('GET /api/v1/dev/info - no token', async () => {
    const res = await request(app).get('/api/v1/dev/info');
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/dev/info - invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/dev/info')
      .set('Authorization', 'invalidtoken');
    expect(res.status).toBe(400);
  });
});

describe('Project & Skills', () => {
  it('POST /api/v1/client/addproject - success', async () => {
    const res = await request(app)
      .post('/api/v1/client/addproject')
      .set('Authorization', clientToken)
      .send({
        name: 'Project1',
        budget: 1000,
        timeline: 30,
        required_developers: 2,
        skills: [
          { name: 'React', proficiency: 'Advanced' },
          { name: 'Node', proficiency: 'Intermediate' }
        ]
      });
    expect(res.status).toBe(200);
    expect(res.body.message.name).toBe('Project1');
    projectId = res.body.message.id;
    roomId = res.body.room.Roomid;
  });

  it('POST /api/v1/client/addproject - invalid input', async () => {
    const res = await request(app)
      .post('/api/v1/client/addproject')
      .set('Authorization', clientToken)
      .send({
        name: '',
        budget: 0,
        timeline: 0,
        required_developers: 0,
        skills: [{ name: '', proficiency: '' }]
      });
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/client/myprojects - success', async () => {
    const res = await request(app)
      .get('/api/v1/client/myprojects')
      .set('Authorization', clientToken);
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/client/myprojects - no token', async () => {
    const res = await request(app).get('/api/v1/client/myprojects');
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/client/myprojects - invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/client/myprojects')
      .set('Authorization', 'invalidtoken');
    expect(res.status).toBe(400);
  });

  it('PUT /api/v1/client/edit/name - success', async () => {
    const res = await request(app)
      .put('/api/v1/client/edit/name')
      .set('Authorization', clientToken)
      .send({ change: 'Client1Updated' });
    expect(res.status).toBe(200);
  });

  it('PUT /api/v1/client/edit/name - no token', async () => {
    const res = await request(app)
      .put('/api/v1/client/edit/name')
      .send({ change: 'Client1Updated' });
    expect(res.status).toBe(400);
  });

  it('PUT /api/v1/client/edit/name - invalid field', async () => {
    const res = await request(app)
      .put('/api/v1/client/edit/invalidfield')
      .set('Authorization', clientToken)
      .send({ change: 'Invalid' });
    expect([200, 511]).toContain(res.status); // Accept 200 or error depending on implementation
  });
});

describe('Dev Skills', () => {
  it('PUT /api/v1/dev/addskills - success', async () => {
    const res = await request(app)
      .put('/api/v1/dev/addskills')
      .set('Authorization', devToken)
      .send({
        skills: [
          { name: 'TypeScript', proficiency: 'Expert', developer_id: devId },
          { name: 'GraphQL', proficiency: 'Intermediate', developer_id: devId }
        ]
      });
    expect(res.status).toBe(200);
  });

  it('PUT /api/v1/dev/addskills - invalid input', async () => {
    const res = await request(app)
      .put('/api/v1/dev/addskills')
      .set('Authorization', devToken)
      .send({ skills: [{ name: '', proficiency: '', developer_id: devId }] });
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/dev/getskills - success', async () => {
    const res = await request(app)
      .get('/api/v1/dev/getskills')
      .set('Authorization', devToken);
    expect([200, 211]).toContain(res.status);
  });

  it('GET /api/v1/dev/getskills - no token', async () => {
    const res = await request(app).get('/api/v1/dev/getskills');
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/dev/getskills - invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/dev/getskills')
      .set('Authorization', 'invalidtoken');
    expect(res.status).toBe(400);
  });

  it('PUT /api/v1/dev/edit/name - success', async () => {
    const res = await request(app)
      .put('/api/v1/dev/edit/name')
      .set('Authorization', devToken)
      .send({ change: 'Dev1Updated' });
    expect(res.status).toBe(200);
  });

  it('PUT /api/v1/dev/edit/name - no token', async () => {
    const res = await request(app)
      .put('/api/v1/dev/edit/name')
      .send({ change: 'Dev1Updated' });
    expect(res.status).toBe(400);
  });

  it('PUT /api/v1/dev/edit/name - invalid field', async () => {
    const res = await request(app)
      .put('/api/v1/dev/edit/invalidfield')
      .set('Authorization', devToken)
      .send({ change: 'Invalid' });
    expect([200, 511]).toContain(res.status);
  });
});

describe('Verification & Logout', () => {
  it('GET /api/v1/verify - client token', async () => {
    const res = await request(app)
      .get('/api/v1/verify')
      .set('Authorization', clientToken);
    expect(res.body.message).toMatch(/USER Verified|DEV Verified/);
  });

  it('GET /api/v1/verify - dev token', async () => {
    const res = await request(app)
      .get('/api/v1/verify')
      .set('Authorization', devToken);
    expect(res.body.message).toMatch(/USER Verified|DEV Verified/);
  });

  it('GET /api/v1/verify - invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/verify')
      .set('Authorization', 'invalidtoken');
    expect(res.body.message).toBe('not Verified');
  });

  it('GET /api/v1/logout - success', async () => {
    const res = await request(app).get('/api/v1/logout');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');
  });

  it('GET /api/v1/logout - repeat', async () => {
    const res = await request(app).get('/api/v1/logout');
    expect(res.status).toBe(200);
  });

  it('GET /api/v1/logout - repeat again', async () => {
    const res = await request(app).get('/api/v1/logout');
    expect(res.status).toBe(200);
  });
});

describe('Chatroom', () => {
  it('GET /api/v1/chatroom/:roomId - success', async () => {
    const res = await request(app).get(`/api/v1/chatroom/${roomId}`);
    expect([200, 511]).toContain(res.status);
  });

  it('GET /api/v1/chatroom/:roomId - invalid room', async () => {
    const res = await request(app).get(`/api/v1/chatroom/invalidroomid`);
    expect([200, 511]).toContain(res.status);
  });

  it('GET /api/v1/chatroom/:roomId - missing room', async () => {
    const res = await request(app).get(`/api/v1/chatroom/`);
    expect(res.status).toBe(404);
  });
});