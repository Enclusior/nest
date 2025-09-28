import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { CreateUserDto } from '../user/dto/user.dto';
import { USER_NOT_FOUND } from '../user/user-constants';
import { User, UserDocument, UserRole } from '../user/user.model';
import { UserService } from '../user/user.service';
import { INVALID_PASSWORD, INVALID_REFRESH_TOKEN } from './auth-constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async register(
		dto: CreateUserDto,
	): Promise<{ access_token: string; refresh_token: string; user: UserDocument }> {
		const user = await this.userService.create(dto);
		const tokens = await this.generateTokens({ email: user.email, role: user.role, _id: user._id });
		return { access_token: tokens.access_token, refresh_token: tokens.refresh_token, user };
	}

	async validateUser(
		email: string,
		password: string,
	): Promise<Pick<User, 'email' | 'role' | '_id'>> {
		const user = await this.userService.findByEmail(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND);
		}
		const isPasswordCorrect = await compare(password, user.passwordHash);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException(INVALID_PASSWORD);
		}
		return { email: user.email, role: user.role, _id: user._id };
	}

	async generateTokens({ email, role, _id }: Pick<User, 'email' | 'role' | '_id'>): Promise<{
		access_token: string;
		refresh_token: string;
	}> {
		const payload = { email, role, sub: _id };
		return {
			access_token: await this.jwtService.signAsync(payload),
			refresh_token: await this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
				expiresIn: '7d',
			}),
		};
	}
	async refreshToken(
		refreshToken: string,
	): Promise<{ access_token: string; refresh_token: string }> {
		try {
			const payload = await this.jwtService.verifyAsync<{
				sub: string;
				email: string;
				role: UserRole;
			}>(refreshToken, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
			});

			const user = await this.userService.findById(payload.sub);
			if (!user) {
				throw new UnauthorizedException(USER_NOT_FOUND);
			}
			return this.generateTokens({
				email: user.email,
				role: user.role,
				_id: user._id,
			});
		} catch {
			throw new BadRequestException(INVALID_REFRESH_TOKEN);
		}
	}
}
