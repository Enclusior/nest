import { IsMongoId } from 'class-validator';

export class RoomIdDto {
	@IsMongoId({ message: 'Parameter <roomId> must be a valid MongoDB ObjectId' })
	roomId: string;
}
