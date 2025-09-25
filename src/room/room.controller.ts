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
import { RoomDto } from './dto/room.dto';
import { RoomModel } from './room.model';
import { RoomService } from './room.service';
import { ROOM_CREATION_FAILED, ROOM_NOT_FOUND } from './room-constants';
import { IdDto } from '../common/dto/id.dto';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post('create')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
	async create(@Body() dto: RoomDto): Promise<RoomModel> {
		if (!dto.seaView || !dto.roomNumber || !dto.name || !dto.type || !dto.price) {
			throw new HttpException(ROOM_CREATION_FAILED, HttpStatus.BAD_REQUEST);
		}
		return this.roomService.create(dto);
	}

	@Get('all')
	async findAll(): Promise<RoomModel[]> {
		const result = await this.roomService.findAll();
		return result;
	}

	@Delete(':id')
	@UsePipes(new ValidationPipe())
	async delete(@Param() params: IdDto): Promise<RoomModel | null> {
		const result = await this.roomService.delete(params.id);
		if (!result) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}

	@Patch(':id')
	@UsePipes(new ValidationPipe())
	async update(@Param() params: IdDto, @Body() dto: RoomDto): Promise<RoomModel | null> {
		const result = await this.roomService.update(params.id, dto);
		if (!result) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}
	@Get(':id')
	@UsePipes(new ValidationPipe())
	async findByRoomId(@Param() params: IdDto): Promise<RoomModel | null> {
		const room = await this.roomService.findByRoomId(params.id);
		if (!room) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return room;
	}
}
