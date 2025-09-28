import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@MinLength(8)
	@MaxLength(32)
	password: string;
}

export class RefreshTokenDto {
	@IsString()
	@IsNotEmpty()
	refreshToken: string;
}
