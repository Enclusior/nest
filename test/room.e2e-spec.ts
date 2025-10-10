import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { RoomModel, RoomType } from '../src/room/room.model';
import { ROOM_NOT_FOUND } from '../src/room/room-constants';
import { disconnect, Types } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDto: AuthDto = {
	email: 'test@test.com',
	password: '12345678',
};

const failedId = '13414141';
const imageTestDto = {
	image: [{ url: '/image.jpg', name: 'image.jpg' }],
};
const roomTestDto = {
	seaView: true,
	roomNumber: 1,
	name: 'Room 1',
	type: RoomType.Single,
	price: 100,
	image: [],
	available: true,
};
const roomTestDtoFailed = {
	roomNumber: 1,
};

describe('RoomController (e2e)', () => {
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

	it('/room/create (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/room/create')
			.send(roomTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(201)
			.then(({ body }: { body: RoomModel }) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/room/create (POST) - failed', () => {
		return request(app.getHttpServer())
			.post('/room/create')
			.send(roomTestDtoFailed)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});

	it('/room/:id (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch('/room/' + createdId)
			.send(roomTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	it('/room/:id (PATCH) - failed', () => {
		return request(app.getHttpServer())
			.patch('/room/' + new Types.ObjectId().toHexString())
			.send(roomTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: ROOM_NOT_FOUND });
	});

	it('/room/:id (PATCH) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.patch('/room/' + failedId)
			.send(roomTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});

	it('/room/:id (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/room/' + createdId)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	it('/room/:id (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/room/' + new Types.ObjectId().toHexString())
			.set('Authorization', `Bearer ${token}`)
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: ROOM_NOT_FOUND });
	});

	it('/room/:id (GET) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.get('/room/' + failedId)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});

	it('/room/:id/attach-images (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch('/room/' + createdId + '/attach-images')
			.send(imageTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	it('/room/:id/attach-images (PATCH) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.patch('/room/' + failedId + '/attach-images')
			.send(imageTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});

	it('/room/:id/attach-images (PATCH) - failed with wrong image', () => {
		return request(app.getHttpServer())
			.patch('/room/' + createdId + '/attach-images')
			.send([{ url: '1' }])
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});

	it('/room/:id/deattach-images (PATCH) - success', () => {
		return request(app.getHttpServer())
			.patch('/room/' + createdId + '/deattach-images')
			.send(imageTestDto)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	it('/room/:id/deattach-all-images (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/room/' + createdId + '/deattach-all-images')
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	it('/room/:id/deattach-all-images (DELETE) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.delete('/room/' + failedId + '/deattach-all-images')
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});

	it('/room/all (GET) - success', () => {
		return request(app.getHttpServer())
			.get('/room/all')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(({ body }: { body: RoomModel[] }) => {
				expect(body.length).toBe(1);
			});
	});
	it('/room/delete/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/room/' + createdId)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	it('/room/delete/:id (DELETE) - failed with wrong id', () => {
		return request(app.getHttpServer())
			.delete('/room/' + failedId)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});

	it('/room/all (GET) - failed', () => {
		return request(app.getHttpServer())
			.get('/room/all')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.then(({ body }: { body: RoomModel[] }) => {
				expect(body.length).toBe(0);
			});
	});

	it('/room/delete/:id (DELETE) - failed', () => {
		return request(app.getHttpServer())
			.delete('/room/' + new Types.ObjectId().toHexString())
			.set('Authorization', `Bearer ${token}`)
			.expect(404, { statusCode: HttpStatus.NOT_FOUND, message: ROOM_NOT_FOUND });
	});

	it('/room/delete/:id (DELETE) - Unauthorized', () => {
		return request(app.getHttpServer())
			.delete('/room/' + createdId)
			.expect(401);
	});

	afterAll(async () => {
		await disconnect();
	});
});
