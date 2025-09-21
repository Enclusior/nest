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
} from '@nestjs/common';
import { ROOM_NOT_FOUND } from 'src/room/room-constants';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleModel } from './schedule.model';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}
	@Post('create')
	async create(@Body() dto: ScheduleDto): Promise<ScheduleModel> {
		return this.scheduleService.create(dto);
	}
	@Delete(':id')
	async delete(@Param('id') id: string): Promise<ScheduleModel | null> {
		return this.scheduleService.delete(id);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: ScheduleDto): Promise<ScheduleModel | null> {
		const result = await this.scheduleService.update(id, dto);
		if (!result) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}
	@Get(':id')
	async findByScheduleId(
		@Param('id') id: Omit<ScheduleModel, '_id'>,
	): Promise<ScheduleModel | null> {
		const schedule = await this.scheduleService.findByScheduleId(id);
		if (!schedule) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return schedule;
	}
	@Get('all')
	async findAll(): Promise<ScheduleModel[]> {
		return this.scheduleService.findAll();
	}
	@Get('byRoom/:roomId')
	async findByRoomId(
		@Param('roomId') roomId: Omit<ScheduleModel, 'roomId'>,
	): Promise<ScheduleModel[]> {
		const result = await this.scheduleService.findByRoomId(roomId);
		if (!result) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}
}
