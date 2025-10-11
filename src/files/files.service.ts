import { Injectable } from '@nestjs/common';
import { MFile } from './mfile.class';
import { IFileResponse } from './types/file-element.response';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { format } from 'date-fns';
import sharp from 'sharp';

@Injectable()
export class FilesService {
	async saveFiles(files: MFile[]): Promise<IFileResponse[]> {
		const dateFolder = format(new Date(), 'yyyy-MM-dd');
		const uploadFolder = path + '/uploads/' + dateFolder;
		await ensureDir(uploadFolder);
		const result: IFileResponse[] = [];
		for (const file of files) {
			await writeFile(uploadFolder + '/' + file.originalname, file.buffer);
			result.push({
				url: dateFolder + '/' + file.originalname,
				name: file.originalname,
			});
		}
		return result;
	}

	async convertToWebp(file: MFile): Promise<MFile> {
		return new MFile({
			originalname: file.originalname,
			buffer: await sharp(file.buffer).webp().toBuffer(),
		});
	}

	async resizeWidth(file: MFile, width: number): Promise<MFile> {
		return new MFile({
			originalname: file.originalname,
			buffer: await sharp(file.buffer).resize(width).toBuffer(),
		});
	}
}
