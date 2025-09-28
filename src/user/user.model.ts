import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
}
@Schema({ timestamps: true })
export class User {
	_id: string;
	@Prop()
	name: string;
	@Prop({ required: true, unique: true })
	email: string;
	@Prop({ required: true })
	passwordHash: string;
	@Prop({ required: true })
	phone: string;
	@Prop({ required: true, default: UserRole.USER })
	role: UserRole;
	@Prop()
	createdAt: Date;
	@Prop()
	updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export interface IRequestWithUser {
	user: IUserPayload;
}
export interface IUserPayload {
	email: string;
	role: UserRole;
	_id: string;
}
