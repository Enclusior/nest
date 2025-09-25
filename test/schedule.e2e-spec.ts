import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ScheduleModel } from '../src/schedule/schedule.model';
import { SCHEDULE_NOT_FOUND } from '../src/schedule/schedule-constants';
import { disconnect, Types } from 'mongoose';

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
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/schedule/create (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleTestDto)
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
			.expect(400);
	});
	it('/schedule/:id (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch('/schedule/' + createdId)
			.send(scheduleTestDto)
			.expect(200);
	});
	it('/schedule/:id (PATCH) - failed', () => {
		return request(app.getHttpServer())
			.patch('/schedule/' + new Types.ObjectId().toHexString())
			.send(scheduleTestDto)
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: SCHEDULE_NOT_FOUND });
	});
	it('/schedule/:id (PATCH) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.patch('/schedule/' + failedId)
			.send(scheduleTestDto)
			.expect(400);
	});
	it('/schedule/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/schedule/' + createdId)
			.expect(200);
	});
	it('/schedule/:id (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/schedule/' + new Types.ObjectId().toHexString())
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: SCHEDULE_NOT_FOUND });
	});
	it('/schedule/:id (GET) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.get('/schedule/' + failedId)
			.expect(400);
	});
	it('/schedule/all (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/schedule/all')
			.expect(200)
			.then(({ body }: { body: ScheduleModel[] }) => {
				expect(body.length).toBe(1);
			});
	});
	it('/schedule/byRoom/:roomId (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/schedule/byRoom/' + roomId)
			.expect(200)
			.then(({ body }: { body: ScheduleModel[] }) => {
				expect(body.length).toBe(1);
			});
	});
	it('/schedule/byRoom/:roomId (GET) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.get('/schedule/byRoom/' + failedId)
			.expect(400);
	});
	it('/schedule/byRoom/:roomId (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/schedule/byRoom/' + new Types.ObjectId().toHexString())
			.expect(200)
			.then(({ body }: { body: ScheduleModel[] }) => {
				expect(body.length).toBe(0);
			});
	});
	it('/schedule/delete/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/schedule/' + createdId)
			.expect(200);
	});
	it('/schedule/all (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/schedule/all')
			.expect(200)
			.then(({ body }: { body: ScheduleModel[] }) => {
				expect(body.length).toBe(0);
			});
	});
	it('/schedule/delete/:id (DELETE) - failed', () => {
		return request(app.getHttpServer())
			.delete('/schedule/' + new Types.ObjectId().toHexString())
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: SCHEDULE_NOT_FOUND });
	});
	it('/schedule/delete/:id (DELETE) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.delete('/schedule/' + failedId)
			.expect(400);
	});
	afterAll(async () => {
		await disconnect();
	});
});
