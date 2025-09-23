import { HttpException, Injectable } from '@nestjs/common';
import { ScheduleDocument, ScheduleModel } from './schedule.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ScheduleDto } from './dto/schedule.dto';
import { SCHEDULE_ALREADY_EXISTS } from './schedule-constants';

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel('ScheduleModel') private readonly scheduleModel: Model<ScheduleDocument>,
	) {}

	async create(dto: ScheduleDto): Promise<ScheduleDocument> {
		const existing = await this.scheduleModel
			.findOne({ roomId: dto.roomId, date: dto.date })
			.exec();
		if (existing) {
			throw new HttpException(SCHEDULE_ALREADY_EXISTS, 400);
		}
		return this.scheduleModel.create(dto);
	}

	async delete(id: Omit<ScheduleModel, '_id'>): Promise<ScheduleDocument | null> {
		return this.scheduleModel.findByIdAndDelete(id).exec();
	}

	async update(id: Omit<ScheduleModel, '_id'>, dto: ScheduleDto): Promise<ScheduleDocument | null> {
		return this.scheduleModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
	async findByScheduleId(id: Omit<ScheduleModel, '_id'>): Promise<ScheduleDocument | null> {
		return this.scheduleModel.findById(id).exec();
	}
	async findByRoomId(roomId: Omit<ScheduleModel, 'roomId'>): Promise<ScheduleDocument[]> {
		return this.scheduleModel.find({ roomId }).exec();
	}

	async findAll(): Promise<ScheduleDocument[]> {
		return this.scheduleModel.find().exec();
	}
}
