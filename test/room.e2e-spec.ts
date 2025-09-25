import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { RoomModel, RoomType } from '../src/room/room.model';
import { ROOM_NOT_FOUND } from '../src/room/room-constants';
import { disconnect, Types } from 'mongoose';

const failedId = '13414141';
const roomTestDto = {
	seaView: true,
	roomNumber: 1,
	name: 'Room 1',
	type: RoomType.Single,
	price: 100,
	available: true,
};
const roomTestDtoFailed = {
	roomNumber: 1,
};

describe('RoomController (e2e)', () => {
	let app: INestApplication<App>;
	let createdId: string;
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/room/create (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/room/create')
			.send(roomTestDto)
			.expect(201)
			.then(({ body }: { body: RoomModel }) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});
	it('/room/create (POST) - failed', () => {
		return request(app.getHttpServer()).post('/room/create').send(roomTestDtoFailed).expect(400);
	});
	it('/room/:id (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch('/room/' + createdId)
			.send(roomTestDto)
			.expect(200);
	});
	it('/room/:id (PATCH) - failed', () => {
		return request(app.getHttpServer())
			.patch('/room/' + new Types.ObjectId().toHexString())
			.send(roomTestDto)
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: ROOM_NOT_FOUND });
	});
	it('/room/:id (PATCH) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.patch('/room/' + failedId)
			.send(roomTestDto)
			.expect(400);
	});
	it('/room/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/room/' + createdId)
			.expect(200);
	});
	it('/room/:id (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/room/' + new Types.ObjectId().toHexString())
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: ROOM_NOT_FOUND });
	});
	it('/room/:id (GET) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.get('/room/' + failedId)
			.expect(400);
	});
	it('/room/all (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/room/all')
			.expect(200)
			.then(({ body }: { body: RoomModel[] }) => {
				expect(body.length).toBe(1);
			});
	});
	it('/room/delete/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/room/' + createdId)
			.expect(200);
	});
	it('/room/delete/:id (DELETE) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.delete('/room/' + failedId)
			.expect(400);
	});
	it('/room/all (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/room/all')
			.expect(200)
			.then(({ body }: { body: RoomModel[] }) => {
				expect(body.length).toBe(0);
			});
	});
	it('/room/delete/:id (DELETE) - failed', () => {
		return request(app.getHttpServer())
			.delete('/room/' + new Types.ObjectId().toHexString())
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: ROOM_NOT_FOUND });
	});
	afterAll(async () => {
		await disconnect();
	});
});
