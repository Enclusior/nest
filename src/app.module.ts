import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
	imports: [RoomModule, ScheduleModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
