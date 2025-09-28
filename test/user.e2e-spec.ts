import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { App } from 'supertest/types';
import request from 'supertest';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { UserDocument, UserRole } from '../src/user/user.model';

const id: string = '68d974d479d86720cd2ded97';
const loginDto: AuthDto = {
	email: 'test@test.com',
	password: '12345678',
};
describe('UserController (e2e)', () => {
	let app: INestApplication<App>;
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
			.then(
				({
					body,
				}: {
					body: { access_token: string; refresh_token: string; user: UserDocument };
				}) => {
					token = body.access_token;
				},
			);
	});
	it('/user/find-all (GET) - success', async () => {
		await request(app.getHttpServer())
			.get('/user/find-all')
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});
	it('/user/find-all (GET) - failed', async () => {
		await request(app.getHttpServer()).get('/user/find-all').expect(401);
	});

	it('/:id(GET) - success', async () => {
		await request(app.getHttpServer())
			.get(`/user/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});
	it('/:id(GET) - failed', async () => {
		await request(app.getHttpServer())
			.get(`/user/5`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
	it('/:id(GET) - Unauthorized', async () => {
		await request(app.getHttpServer()).get(`/user/${id}`).expect(401);
	});

	it('/:id/role (PATCH) - success', async () => {
		await request(app.getHttpServer())
			.patch(`/user/${id}/role`)
			.send({ role: UserRole.ADMIN })
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});
	it('/:id/role (PATCH) - failed', async () => {
		await request(app.getHttpServer())
			.patch(`/user/${id}/role`)
			.send({ role: '5' })
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
	it('/:id/role (PATCH) - Unauthorized', async () => {
		await request(app.getHttpServer())
			.patch(`/user/${id}/role`)
			.send({ role: UserRole.ADMIN })
			.expect(401);
	});
	it('/:id (PATCH) - success', async () => {
		await request(app.getHttpServer())
			.patch(`/user/${id}`)
			.send({ name: 'Test' })
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});
	it('/:id (PATCH) - failed', async () => {
		await request(app.getHttpServer())
			.patch(`/user/19k974d479d86720cd2ded97`)
			.send({ name: 5 })
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
	it('/:id (PATCH) - Unauthorized', async () => {
		await request(app.getHttpServer()).patch(`/user/${id}`).send({ name: 'Test' }).expect(401);
	});

	// it('/:id (DELETE) - success', async () => {
	// 	await request(app.getHttpServer())
	// 		.delete(`/user/${id}`)
	// 		.set('Authorization', `Bearer ${token}`)
	// 		.expect(200);
	// });
	it('/:id (DELETE) - failed', async () => {
		await request(app.getHttpServer())
			.delete(`/user/19k974d479d86720cd2ded97`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);
	});
	it('/:id (DELETE) - Unauthorized', async () => {
		await request(app.getHttpServer()).delete(`/user/${id}`).expect(401);
	});
});
