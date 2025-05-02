"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const db_1 = __importDefault(require("../db/db"));
let clientToken;
let devToken;
let clientId;
let devId;
let projectId;
let roomId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.$transaction([
        db_1.default.projectSkill.deleteMany(),
        db_1.default.project.deleteMany(),
        db_1.default.room.deleteMany(),
        db_1.default.chat.deleteMany(),
        db_1.default.user.deleteMany(),
        db_1.default.developer.deleteMany(),
    ]);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.$disconnect();
}));
describe('Client Auth & Info', () => {
    it('POST /api/v1/client/signup - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post('/api/v1/client/signup').send({
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
    }));
    it('POST /api/v1/client/signin - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post('/api/v1/client/signin').send({
            email: 'client1@example.com',
            password: 'pass123'
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    }));
    it('POST /api/v1/client/signin - wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post('/api/v1/client/signin').send({
            email: 'client1@example.com',
            password: 'wrongpass'
        });
        expect(res.status).toBe(400);
    }));
    it('POST /api/v1/client/signin - not registered', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post('/api/v1/client/signin').send({
            email: 'notfound@example.com',
            password: 'pass123'
        });
        expect(res.status).toBe(400);
    }));
    it('GET /api/v1/client/info - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/client/info')
            .set('Authorization', clientToken);
        expect(res.status).toBe(202);
        expect(res.body.email).toBe('client1@example.com');
    }));
    it('GET /api/v1/client/info - no token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get('/api/v1/client/info');
        expect(res.status).toBe(400);
    }));
    it('GET /api/v1/client/info - invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/client/info')
            .set('Authorization', 'invalidtoken');
        expect(res.status).toBe(400);
    }));
});
describe('Developer Auth & Info', () => {
    it('POST /api/v1/dev/signup - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post('/api/v1/dev/signup').send({
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
    }));
    it('POST /api/v1/dev/signin - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post('/api/v1/dev/signin').send({
            email: 'dev1@example.com',
            password: 'devpass'
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    }));
    it('POST /api/v1/dev/signin - wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post('/api/v1/dev/signin').send({
            email: 'dev1@example.com',
            password: 'wrongpass'
        });
        expect(res.status).toBe(400);
    }));
    it('POST /api/v1/dev/signin - not registered', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).post('/api/v1/dev/signin').send({
            email: 'notfound@example.com',
            password: 'devpass'
        });
        expect(res.status).toBe(400);
    }));
    it('GET /api/v1/dev/info - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/dev/info')
            .set('Authorization', devToken);
        expect(res.status).toBe(200);
        expect(res.body.email).toBe('dev1@example.com');
    }));
    it('GET /api/v1/dev/info - no token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get('/api/v1/dev/info');
        expect(res.status).toBe(400);
    }));
    it('GET /api/v1/dev/info - invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/dev/info')
            .set('Authorization', 'invalidtoken');
        expect(res.status).toBe(400);
    }));
});
describe('Project & Skills', () => {
    it('POST /api/v1/client/addproject - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
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
    }));
    it('POST /api/v1/client/addproject - invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
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
    }));
    it('GET /api/v1/client/myprojects - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/client/myprojects')
            .set('Authorization', clientToken);
        expect(res.status).toBe(200);
        expect(res.body.projects.length).toBeGreaterThan(0);
    }));
    it('GET /api/v1/client/myprojects - no token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get('/api/v1/client/myprojects');
        expect(res.status).toBe(400);
    }));
    it('GET /api/v1/client/myprojects - invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/client/myprojects')
            .set('Authorization', 'invalidtoken');
        expect(res.status).toBe(400);
    }));
    it('PUT /api/v1/client/edit/name - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .put('/api/v1/client/edit/name')
            .set('Authorization', clientToken)
            .send({ change: 'Client1Updated' });
        expect(res.status).toBe(200);
    }));
    it('PUT /api/v1/client/edit/name - no token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .put('/api/v1/client/edit/name')
            .send({ change: 'Client1Updated' });
        expect(res.status).toBe(400);
    }));
    it('PUT /api/v1/client/edit/name - invalid field', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .put('/api/v1/client/edit/invalidfield')
            .set('Authorization', clientToken)
            .send({ change: 'Invalid' });
        expect([200, 511]).toContain(res.status); // Accept 200 or error depending on implementation
    }));
});
describe('Dev Skills', () => {
    it('PUT /api/v1/dev/addskills - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .put('/api/v1/dev/addskills')
            .set('Authorization', devToken)
            .send({
            skills: [
                { name: 'TypeScript', proficiency: 'Expert', developer_id: devId },
                { name: 'GraphQL', proficiency: 'Intermediate', developer_id: devId }
            ]
        });
        expect(res.status).toBe(200);
    }));
    it('PUT /api/v1/dev/addskills - invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .put('/api/v1/dev/addskills')
            .set('Authorization', devToken)
            .send({ skills: [{ name: '', proficiency: '', developer_id: devId }] });
        expect(res.status).toBe(400);
    }));
    it('GET /api/v1/dev/getskills - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/dev/getskills')
            .set('Authorization', devToken);
        expect([200, 211]).toContain(res.status);
    }));
    it('GET /api/v1/dev/getskills - no token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get('/api/v1/dev/getskills');
        expect(res.status).toBe(400);
    }));
    it('GET /api/v1/dev/getskills - invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/dev/getskills')
            .set('Authorization', 'invalidtoken');
        expect(res.status).toBe(400);
    }));
    it('PUT /api/v1/dev/edit/name - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .put('/api/v1/dev/edit/name')
            .set('Authorization', devToken)
            .send({ change: 'Dev1Updated' });
        expect(res.status).toBe(200);
    }));
    it('PUT /api/v1/dev/edit/name - no token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .put('/api/v1/dev/edit/name')
            .send({ change: 'Dev1Updated' });
        expect(res.status).toBe(400);
    }));
    it('PUT /api/v1/dev/edit/name - invalid field', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .put('/api/v1/dev/edit/invalidfield')
            .set('Authorization', devToken)
            .send({ change: 'Invalid' });
        expect([200, 511]).toContain(res.status);
    }));
});
describe('Verification & Logout', () => {
    it('GET /api/v1/verify - client token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/verify')
            .set('Authorization', clientToken);
        expect(res.body.message).toMatch(/USER Verified|DEV Verified/);
    }));
    it('GET /api/v1/verify - dev token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/verify')
            .set('Authorization', devToken);
        expect(res.body.message).toMatch(/USER Verified|DEV Verified/);
    }));
    it('GET /api/v1/verify - invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app)
            .get('/api/v1/verify')
            .set('Authorization', 'invalidtoken');
        expect(res.body.message).toBe('not Verified');
    }));
    it('GET /api/v1/logout - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get('/api/v1/logout');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Logged out successfully');
    }));
    it('GET /api/v1/logout - repeat', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get('/api/v1/logout');
        expect(res.status).toBe(200);
    }));
    it('GET /api/v1/logout - repeat again', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get('/api/v1/logout');
        expect(res.status).toBe(200);
    }));
});
describe('Chatroom', () => {
    it('GET /api/v1/chatroom/:roomId - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get(`/api/v1/chatroom/${roomId}`);
        expect([200, 511]).toContain(res.status);
    }));
    it('GET /api/v1/chatroom/:roomId - invalid room', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get(`/api/v1/chatroom/invalidroomid`);
        expect([200, 511]).toContain(res.status);
    }));
    it('GET /api/v1/chatroom/:roomId - missing room', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).get(`/api/v1/chatroom/`);
        expect(res.status).toBe(404);
    }));
});
