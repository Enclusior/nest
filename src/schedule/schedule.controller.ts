import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ROOM_NOT_FOUND } from '../room/room-constants';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleDocument } from './schedule.model';
import { ScheduleService } from './schedule.service';
import { SCHEDULE_CREATION_FAILED, SCHEDULE_NOT_FOUND } from './schedule-constants';
import { IdDto } from '../common/dto/id.dto';
import { RoomIdDto } from '../common/dto/room-id.dto';
import { Roles } from '../decorators/role.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { UserRole } from '../user/user.model';
import { StatisticsDto } from './dto/statistics.dto';
import { StatisticsResponse } from './types/statistics.types';

@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}
	@Post('create')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
	async create(@Body() dto: ScheduleDto): Promise<ScheduleDocument> {
		if (!dto.roomId || !dto.date) {
			throw new HttpException(SCHEDULE_CREATION_FAILED, HttpStatus.BAD_REQUEST);
		}
		return this.scheduleService.create(dto);
	}
	@Get('all')
	@UseGuards(JwtAuthGuard)
	async findAll(): Promise<ScheduleDocument[]> {
		const result = await this.scheduleService.findAll();
		return result;
	}
	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@UsePipes(new ValidationPipe())
	async delete(@Param() params: IdDto): Promise<ScheduleDocument | null> {
		const result = await this.scheduleService.delete(params.id);
		if (!result) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@UsePipes(new ValidationPipe())
	async update(@Param() params: IdDto, @Body() dto: ScheduleDto): Promise<ScheduleDocument | null> {
		const result = await this.scheduleService.update(params.id, dto);
		if (!result) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}
	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	async findByScheduleId(@Param() params: IdDto): Promise<ScheduleDocument | null> {
		const schedule = await this.scheduleService.findByScheduleId(params.id);
		if (!schedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedule;
	}

	@Get('byRoom/:roomId')
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	async findByRoomId(@Param() params: RoomIdDto): Promise<ScheduleDocument[]> {
		const result = await this.scheduleService.findByRoomId(params.roomId);
		if (!result) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}
	@HttpCode(200)
	@Post('statistics')
	@UseGuards(JwtAuthGuard)
	@Roles(UserRole.ADMIN)
	@UsePipes(new ValidationPipe())
	async getStatistics(@Body() dto: StatisticsDto): Promise<StatisticsResponse[]> {
		return this.scheduleService.getStatistics(dto.month, dto.year);
	}
}
