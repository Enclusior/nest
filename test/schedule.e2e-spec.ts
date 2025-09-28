import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ScheduleModel } from '../src/schedule/schedule.model';
import { SCHEDULE_NOT_FOUND } from '../src/schedule/schedule-constants';
import { disconnect, Types } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDto: AuthDto = {
	email: 'test@test.com',
	password: '12345678',
};
const roomId = new Types.ObjectId().toHexString();
const failedId = '13414141';
const scheduleTestDto = {
	date: new Date().toISOString(),
	roomId,
};
const scheduleTestDtoFailed = {
	price: 100,
};

describe('ScheduleController (e2e)', () => {
	let app: INestApplication<App>;
	let createdId: string;
	let token: string;
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
		await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: { body: { access_token: string } }) => {
				token = body.access_token;
			});
	});

	it('/schedule/create (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(201)
			.then(({ body }: { body: ScheduleModel }) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});
	it('/schedule/create (POST) - failed', () => {
		return request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleTestDtoFailed)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
	it('/schedule/:id (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch('/schedule/' + createdId)
			.send(scheduleTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});
	it('/schedule/:id (PATCH) - failed', () => {
		return request(app.getHttpServer())
			.patch('/schedule/' + new Types.ObjectId().toHexString())
			.send(scheduleTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: SCHEDULE_NOT_FOUND });
	});
	it('/schedule/:id (PATCH) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.patch('/schedule/' + failedId)
			.send(scheduleTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
	it('/schedule/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/schedule/' + createdId)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});
	it('/schedule/:id (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/schedule/' + new Types.ObjectId().toHexString())
			.set('Authorization', `Bearer ${token}`)
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: SCHEDULE_NOT_FOUND });
	});
	it('/schedule/:id (GET) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.get('/schedule/' + failedId)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
	it('/schedule/all (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/schedule/all')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(({ body }: { body: ScheduleModel[] }) => {
				expect(body.length).toBe(1);
			});
	});
	it('/schedule/byRoom/:roomId (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/schedule/byRoom/' + roomId)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(({ body }: { body: ScheduleModel[] }) => {
				expect(body.length).toBe(1);
			});
	});
	it('/schedule/byRoom/:roomId (GET) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.get('/schedule/byRoom/' + failedId)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
	it('/schedule/byRoom/:roomId (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/schedule/byRoom/' + new Types.ObjectId().toHexString())
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(({ body }: { body: ScheduleModel[] }) => {
				expect(body.length).toBe(0);
			});
	});
	it('/schedule/delete/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/schedule/' + createdId)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});
	it('/schedule/all (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/schedule/all')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(({ body }: { body: ScheduleModel[] }) => {
				expect(body.length).toBe(0);
			});
	});
	it('/schedule/delete/:id (DELETE) - failed', () => {
		return request(app.getHttpServer())
			.delete('/schedule/' + new Types.ObjectId().toHexString())
			.set('Authorization', `Bearer ${token}`)
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: SCHEDULE_NOT_FOUND });
	});
	it('/schedule/delete/:id (DELETE) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.delete('/schedule/' + failedId)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
	it('/schedule/delete/:id (DELETE) - Unauthorized', () => {
		return request(app.getHttpServer())
			.delete('/schedule/' + createdId)
			.expect(401);
	});
	afterAll(async () => {
		await disconnect();
	});
});
