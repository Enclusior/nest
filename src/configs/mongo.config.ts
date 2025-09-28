import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = (configService: ConfigService): MongooseModuleOptions => {
	return {
		uri: getMongooseString(configService),
		...getMongooseOptions(),
	};
};

//mongodb://localhost:27017/top-api

export const getMongooseString = (configService: ConfigService) => {
	const login = configService.get<string>('MONGO_LOGIN');
	const password = configService.get<string>('MONGO_PASSWORD');
	const host = configService.get<string>('MONGO_HOST');
	const port = configService.get<string>('MONGO_PORT');
	const db = configService.get<string>('MONGO_DB');

	return `mongodb://${login}:${password}@${host}:${port}/${db}`;
};

export const getMongooseOptions = () => {
	return {
		authSource: 'admin',
	};
};
