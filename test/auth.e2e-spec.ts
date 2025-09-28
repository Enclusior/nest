import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { App } from 'supertest/types';
import request from 'supertest';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { disconnect } from 'mongoose';
import { CreateUserDto } from '../src/user/dto/user.dto';
import { UserDocument, UserRole } from '../src/user/user.model';

const mockEmail = Math.random().toString(36).substring(2, 15) + '@mail.ru';
// const mockEmail = 'test@test.com';

const registerDto: CreateUserDto = {
	email: mockEmail,
	password: '12345678',
	phone: '+79999999999',
	name: 'John Doe',
};

const loginDto: AuthDto = {
	email: mockEmail,
	password: '12345678',
};

describe('AuthController (e2e)', () => {
	let app: INestApplication<App>;
	let refresh_token: string;
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/register (POST) - success', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(registerDto)
			.expect(201)
			.then(
				({
					body,
				}: {
					body: { access_token: string; refresh_token: string; user: UserDocument };
				}) => {
					expect(body.user).toBeDefined();
					expect(body.user.email).toBe(registerDto.email);
					expect(body.user.phone).toBe(registerDto.phone);
					expect(body.user.name).toBe(registerDto.name);
					expect(body.user.role).toBe(UserRole.USER || UserRole.ADMIN);
					expect(body.access_token).toBeDefined();
					expect(typeof body.access_token).toBe('string');
					expect(body.access_token.length).toBeGreaterThan(0);
					expect(body.refresh_token).toBeDefined();
					expect(typeof body.refresh_token).toBe('string');
					expect(body.refresh_token.length).toBeGreaterThan(0);
					refresh_token = body.refresh_token;
				},
			);
	});

	it('/auth/register (POST) - failed', async () => {
		await request(app.getHttpServer()).post('/auth/register').send(registerDto).expect(400);
	});

	it('/auth/login (POST) - success', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: { body: { access_token: string; refresh_token: string } }) => {
				expect(body.access_token).toBeDefined();
				expect(typeof body.access_token).toBe('string');
				expect(body.access_token.length).toBeGreaterThan(0);
				expect(body.refresh_token).toBeDefined();
				expect(typeof body.refresh_token).toBe('string');
				expect(body.refresh_token.length).toBeGreaterThan(0);
				refresh_token = body.refresh_token;
			});
	});
	it('/auth/login (POST) - failed', async () => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: '123456789' })
			.expect(401);
	});
	it('/auth/refresh (POST) - success', async () => {
		await request(app.getHttpServer())
			.post('/auth/refresh')
			.send({ refreshToken: refresh_token })
			.expect(200)
			.then(({ body }: { body: { access_token: string; refresh_token: string } }) => {
				expect(body.access_token).toBeDefined();
				expect(typeof body.access_token).toBe('string');
				expect(body.access_token.length).toBeGreaterThan(0);
				expect(body.refresh_token).toBeDefined();
				expect(typeof body.refresh_token).toBe('string');
				expect(body.refresh_token.length).toBeGreaterThan(0);
				refresh_token = body.refresh_token;
			});
	});
	it('/auth/refresh (POST) - failed', async () => {
		await request(app.getHttpServer())
			.post('/auth/refresh')
			.send({ refreshToken: '123456789' })
			.expect(400);
	});
	afterAll(async () => {
		await disconnect();
	});
});
