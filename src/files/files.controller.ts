import {
	Controller,
	HttpCode,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFileResponse } from './types/file-element.response';
import { MFile } from './mfile.class';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserRole } from '../user/user.model';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../decorators/role.decorator';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@HttpCode(200)
	@UseInterceptors(FileInterceptor('file'))
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Post('upload')
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<IFileResponse[]> {
		const saveArray: MFile[] = [];
		if (file.mimetype.includes('image')) {
			const resizedFile = await this.filesService.resizeWidth(file, 500);
			saveArray.push(
				new MFile({
					originalname: resizedFile.originalname,
					buffer: resizedFile.buffer,
				}),
			);
			const webpFile = await this.filesService.convertToWebp(resizedFile);
			saveArray.push(
				new MFile({
					originalname: webpFile.originalname.split('.')[0] + '.webp',
					buffer: webpFile.buffer,
				}),
			);
		} else {
			saveArray.push(new MFile(file));
		}
		return this.filesService.saveFiles(saveArray);
	}
}
