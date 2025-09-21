import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoomModel, RoomDocument } from './room.model';
import { Model } from 'mongoose';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
	constructor(@InjectModel('RoomModel') private readonly roomModel: Model<RoomDocument>) {}
	async create(dto: RoomDto): Promise<RoomDocument> {
		return this.roomModel.create(dto);
	}

	async delete(id: Omit<RoomModel, '_id'>): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndDelete(id).exec();
	}

	async update(id: Omit<RoomModel, '_id'>, dto: RoomDto): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
	async findByRoomId(id: Omit<RoomModel, '_id'>): Promise<RoomDocument | null> {
		return this.roomModel.findById(id).exec();
	}
}
