import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class ImageDto {
	@IsString({ message: 'Parameter <url> must be a string' })
	url: string;

	@IsString({ message: 'Parameter <fileName> must be a string' })
	name: string;
}
export class AttachImageToRoomDto {
	@IsArray({ message: 'Parameter <image> must be an array' })
	@ValidateNested({ each: true })
	@Type(() => ImageDto)
	image: ImageDto[];
}
