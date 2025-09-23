import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleSchema } from './schedule.model';

@Module({
	providers: [ScheduleService],
	imports: [MongooseModule.forFeature([{ name: 'ScheduleModel', schema: ScheduleSchema }])],
	controllers: [ScheduleController],
})
export class ScheduleModule {}
