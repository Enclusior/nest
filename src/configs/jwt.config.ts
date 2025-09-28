import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => {
	return {
		secret: configService.get('JWT_SECRET'),
		signOptions: { expiresIn: '1h' },
	};
};

export const getJwtRefreshConfig = (configService: ConfigService): JwtModuleOptions => {
	return {
		secret: configService.get('JWT_REFRESH_SECRET'),
		signOptions: { expiresIn: '7d' },
	};
};
