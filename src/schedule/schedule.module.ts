import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModel, ScheduleSchema } from './schedule.model';

@Module({
	providers: [ScheduleService],
	imports: [MongooseModule.forFeature([{ name: ScheduleModel.name, schema: ScheduleSchema }])],
	controllers: [ScheduleController],
})
export class ScheduleModule {}
