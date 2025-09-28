import { USER_ROLE_REQUIRED } from '../user-constants';
import { UserRole } from '../user.model';
import {
	IsString,
	IsEmail,
	IsNotEmpty,
	IsEnum,
	MinLength,
	MaxLength,
	IsPhoneNumber,
	IsOptional,
} from 'class-validator';
export class CreateUserDto {
	@IsString()
	name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	password: string;

	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber('RU')
	phone: string;
}

export class UpdateUserRoleDto {
	@IsEnum(UserRole, { message: USER_ROLE_REQUIRED })
	@IsNotEmpty()
	role: UserRole;
}

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	@IsPhoneNumber('RU')
	phone?: string;
}
