// import { INestApplication } from '@nestjs/common';
// import { TestingModule, Test } from '@nestjs/testing';
// import request from 'supertest';
// import { AppModule } from '../src/app.module';
// import { App } from 'supertest/types';
// import { AuthDto } from '../src/auth/dto/auth.dto';
// import { disconnect } from 'mongoose';
// const loginDto: AuthDto = {
// 	email: 'test@test.com',
// 	password: '12345678',
// };
// describe('FilesController (e2e)', () => {
// 	let app: INestApplication<App>;
// 	let token: string;
// 	beforeEach(async () => {
// 		const moduleFixture: TestingModule = await Test.createTestingModule({
// 			imports: [AppModule],
// 		}).compile();

// 		app = moduleFixture.createNestApplication();
// 		await app.init();
// 		await request(app.getHttpServer())
// 			.post('/auth/login')
// 			.send(loginDto)
// 			.expect(200)
// 			.then(({ body }: { body: { access_token: string } }) => {
// 				token = body.access_token;
// 			});
// 	});

// 	afterAll(async () => {
// 		await disconnect();
// 	});
// });
