import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoomDocument } from './room.model';
import { Model } from 'mongoose';
import { RoomDto } from './dto/room.dto';
import { AttachImageToRoomDto } from './dto/attachImageToRoom.dto';

@Injectable()
export class RoomService {
	constructor(@InjectModel('RoomModel') private readonly roomModel: Model<RoomDocument>) {}
	async create(dto: RoomDto): Promise<RoomDocument> {
		return this.roomModel.create(dto);
	}

	async delete(id: string): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndDelete(id).exec();
	}

	async update(id: string, dto: RoomDto): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
	async findByRoomId(id: string): Promise<RoomDocument | null> {
		return this.roomModel.findById(id).exec();
	}
	async findAll(): Promise<RoomDocument[]> {
		return this.roomModel.find().exec();
	}
	async attachImage(id: string, dto: AttachImageToRoomDto): Promise<RoomDocument | null> {
		return this.roomModel
			.findByIdAndUpdate(id, { $push: { image: dto.image } }, { new: true })
			.exec();
	}
	async deattachImage(id: string, dto: AttachImageToRoomDto): Promise<RoomDocument | null> {
		return this.roomModel
			.findByIdAndUpdate(id, { $pull: { image: { $in: dto.image } } }, { new: true })
			.exec();
	}

	async deattachAllImage(id: string): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndUpdate(id, { $set: { image: [] } }, { new: true }).exec();
	}
}
