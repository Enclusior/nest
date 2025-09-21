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
import { RoomDto } from './dto/room.dto';
import { RoomModel } from './room.model';
import { RoomService } from './room.service';
import { ROOM_NOT_FOUND } from './room-constants';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}
	@Post('create')
	async create(@Body() dto: RoomDto): Promise<RoomModel> {
		return this.roomService.create(dto);
	}
	@Delete(':id')
	async delete(@Param('id') id: Omit<RoomModel, '_id'>): Promise<RoomModel | null> {
		return this.roomService.delete(id);
	}

	@Patch(':id')
	async update(
		@Param('id') id: Omit<RoomModel, '_id'>,
		@Body() dto: RoomDto,
	): Promise<RoomModel | null> {
		const result = await this.roomService.update(id, dto);
		if (!result) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}
	@Get(':id')
	async findByRoomId(@Param('id') id: Omit<RoomModel, '_id'>): Promise<RoomModel | null> {
		const room = await this.roomService.findByRoomId(id);
		if (!room) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return room;
	}
}
