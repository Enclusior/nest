import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModel, RoomSchema } from './room.model';

@Module({
	providers: [RoomService],
	imports: [MongooseModule.forFeature([{ name: RoomModel.name, schema: RoomSchema }])],
	controllers: [RoomController],
})
export class RoomModule {}
