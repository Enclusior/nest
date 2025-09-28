import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';

export type ScheduleDocument = HydratedDocument<ScheduleModel>;

@Schema()
export class ScheduleModel {
	_id: string;
	@Prop({ required: true })
	date: Date;
	@Prop({ type: MSchema.Types.ObjectId, required: true, ref: 'RoomModel' })
	roomId: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel);
