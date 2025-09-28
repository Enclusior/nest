import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserDocument } from '../user/user.model';
import { AuthDto, RefreshTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(201)
	@UsePipes(new ValidationPipe())
	async register(
		@Body() dto: CreateUserDto,
	): Promise<{ access_token: string; refresh_token: string; user: UserDocument }> {
		return this.authService.register(dto);
	}

	@Post('login')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async login(@Body() dto: AuthDto): Promise<{ access_token: string; refresh_token: string }> {
		const user = await this.authService.validateUser(dto.email, dto.password);
		return this.authService.generateTokens(user);
	}

	@Post('refresh')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async refreshToken(
		@Body() dto: RefreshTokenDto,
	): Promise<{ access_token: string; refresh_token: string }> {
		return this.authService.refreshToken(dto.refreshToken);
	}
}
