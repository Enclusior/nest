import { HttpException, Injectable } from '@nestjs/common';
import { ScheduleDocument } from './schedule.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ScheduleDto } from './dto/schedule.dto';
import { SCHEDULE_ALREADY_EXISTS } from './schedule-constants';
import { StatisticsResponse } from './types/statistics.types';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel('ScheduleModel') private readonly scheduleModel: Model<ScheduleDocument>,
		private readonly telegramService: TelegramService,
	) {}

	async create(dto: ScheduleDto): Promise<ScheduleDocument> {
		const existing = await this.scheduleModel
			.findOne({ roomId: dto.roomId, date: dto.date })
			.exec();
		if (existing) {
			throw new HttpException(SCHEDULE_ALREADY_EXISTS, 400);
		}
		await this.telegramService.sendMessage(`New schedule created: ${dto.date} ${dto.roomId}`);
		return this.scheduleModel.create(dto);
	}

	async delete(id: string): Promise<ScheduleDocument | null> {
		return this.scheduleModel.findByIdAndDelete(id).exec();
	}

	async update(id: string, dto: ScheduleDto): Promise<ScheduleDocument | null> {
		return this.scheduleModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
	async findByScheduleId(id: string): Promise<ScheduleDocument | null> {
		return this.scheduleModel.findById(id).exec();
	}
	async findByRoomId(roomId: string): Promise<ScheduleDocument[]> {
		return this.scheduleModel.find({ roomId }).exec();
	}

	async findAll(): Promise<ScheduleDocument[]> {
		return this.scheduleModel.find().exec();
	}
	async getStatistics(month: number, year: number): Promise<StatisticsResponse[]> {
		return await this.scheduleModel.aggregate([
			{
				$match: {
					date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
				},
			},
			{
				$group: {
					_id: '$roomId',
					bookedDays: { $sum: 1 },
				},
			},
			{
				$lookup: {
					from: 'rooms',
					localField: '_id',
					foreignField: '_id',
					as: 'room',
				},
			},
			{
				$unwind: '$room',
			},
			{
				$project: {
					_id: 0,
					roomNumber: '$room.roomNumber',
					bookedDays: 1,
				},
			},
			{
				$sort: {
					roomNumber: 1,
				},
			},
		]);
	}
}
