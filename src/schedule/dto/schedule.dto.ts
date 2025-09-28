import { IsString, IsISO8601 } from 'class-validator';
export class ScheduleDto {
	@IsISO8601()
	date: string;

	@IsString({ message: 'Parameter <roomId> must be a string' })
	roomId: string;
}
