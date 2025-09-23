import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './room.model';

@Module({
	providers: [RoomService],
	imports: [MongooseModule.forFeature([{ name: 'RoomModel', schema: RoomSchema }])],
	controllers: [RoomController],
})
export class RoomModule {}
