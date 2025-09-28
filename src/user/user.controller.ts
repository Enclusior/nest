import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IdDto } from '../common/dto/id.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/user.dto';
import { Roles } from '../decorators/role.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { UserDocument, UserRole } from './user.model';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('find-all')
	@UseGuards(JwtAuthGuard)
	async findAll(): Promise<UserDocument[]> {
		return this.userService.findAll();
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	async findById(@Param() params: IdDto): Promise<UserDocument | null> {
		return this.userService.findById(params.id);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@UsePipes(new ValidationPipe())
	async delete(@Param() params: IdDto): Promise<UserDocument | null> {
		return this.userService.delete(params.id);
	}

	@Patch(':id/role')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@UsePipes(new ValidationPipe())
	async updateRole(@Param() params: IdDto, @Body() dto: UpdateUserRoleDto): Promise<UserDocument> {
		return this.userService.updateRole(params.id, dto.role);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@UsePipes(new ValidationPipe())
	async update(@Param() params: IdDto, @Body() dto: UpdateUserDto): Promise<UserDocument | null> {
		return this.userService.update(params.id, dto);
	}
}
