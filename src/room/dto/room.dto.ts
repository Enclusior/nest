import { RoomType } from '../room.model';
import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';

export class RoomDto {
	@IsString({ message: 'Parameter <name> must be a string' })
	name: string;

	@IsBoolean({ message: 'Parameter <seaView> must be a boolean' })
	seaView: boolean;

	@IsNumber({}, { message: 'Parameter <roomNumber> must be a number' })
	roomNumber: number;

	@IsString({ message: 'Parameter <type> must be a string' })
	type: RoomType;

	@Min(1, { message: 'Parameter <price> must be greater than 1' })
	@IsNumber({}, { message: 'Parameter <price> must be a number' })
	price: number;

	@IsBoolean({ message: 'Parameter <available> must be a boolean' })
	available: boolean;
}
