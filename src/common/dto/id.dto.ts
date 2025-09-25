import { IsMongoId } from 'class-validator';

export class IdDto {
	@IsMongoId({ message: 'Parameter <id> must be a valid MongoDB ObjectId' })
	id: string;
}
