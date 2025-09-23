import { RoomType } from '../room.model';

export class RoomDto {
	name: string;
	seaView: boolean;
	roomNumber: number;
	type: RoomType;
	price: number;
	available: boolean;
}
