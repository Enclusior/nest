import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ROOM_NOT_FOUND } from '../room/room-constants';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleModel } from './schedule.model';
import { ScheduleService } from './schedule.service';
import { SCHEDULE_CREATION_FAILED, SCHEDULE_NOT_FOUND } from './schedule-constants';
import { IdDto } from '../common/dto/id.dto';
import { RoomIdDto } from '../common/dto/room-id.dto';

@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}
	@Post('create')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
	async create(@Body() dto: ScheduleDto): Promise<ScheduleModel> {
		if (!dto.roomId || !dto.date) {
			throw new HttpException(SCHEDULE_CREATION_FAILED, HttpStatus.BAD_REQUEST);
		}
		return this.scheduleService.create(dto);
	}
	@Get('all')
	async findAll(): Promise<ScheduleModel[]> {
		const result = await this.scheduleService.findAll();
		return result;
	}
	@Delete(':id')
	@UsePipes(new ValidationPipe())
	async delete(@Param() params: IdDto): Promise<ScheduleModel | null> {
		const result = await this.scheduleService.delete(params.id);
		if (!result) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}

	@Patch(':id')
	@UsePipes(new ValidationPipe())
	async update(@Param() params: IdDto, @Body() dto: ScheduleDto): Promise<ScheduleModel | null> {
		const result = await this.scheduleService.update(params.id, dto);
		if (!result) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}
	@Get(':id')
	@UsePipes(new ValidationPipe())
	async findByScheduleId(@Param() params: IdDto): Promise<ScheduleModel | null> {
		const schedule = await this.scheduleService.findByScheduleId(params.id);
		if (!schedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedule;
	}

	@Get('byRoom/:roomId')
	@UsePipes(new ValidationPipe())
	async findByRoomId(@Param() params: RoomIdDto): Promise<ScheduleModel[]> {
		const result = await this.scheduleService.findByRoomId(params.roomId);
		if (!result) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}
}
