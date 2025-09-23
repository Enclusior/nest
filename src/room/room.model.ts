import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum RoomType {
	Single = 'single',
	Double = 'double',
}
export type RoomDocument = HydratedDocument<RoomModel>;

@Schema({ timestamps: true })
export class RoomModel {
	_id: string;
	@Prop({ required: true })
	seaView: boolean;
	@Prop({ required: true })
	roomNumber: number;
	@Prop({ required: true })
	name: string;
	@Prop({ required: true })
	type: RoomType;
	@Prop({ required: true })
	price: number;
	@Prop({ required: true, default: true })
	available: boolean;
}
export const RoomSchema = SchemaFactory.createForClass(RoomModel);
