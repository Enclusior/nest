import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserRole } from '../user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET')!,
		});
	}
	validate({
		email,
		role,
		sub,
	}: {
		email: string;
		role: UserRole;
		sub: string;
	}): Pick<User, 'email' | 'role' | '_id'> {
		return { email, role, _id: sub };
	}
}
