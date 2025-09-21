import { RoomType } from '../room.model';

export class RoomDto {
	name: string;
	type: RoomType;
	price: number;
	available: boolean;
}
