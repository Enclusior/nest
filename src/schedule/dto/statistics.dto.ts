import { IsNumber, Max, Min } from 'class-validator';

const MAX_YEAR = new Date().getFullYear();

export class StatisticsDto {
	@IsNumber()
	@Min(1)
	@Max(12)
	month: number;
	@IsNumber()
	@Min(2020)
	@Max(MAX_YEAR)
	year: number;
}
