import { ModuleMetadata } from '@nestjs/common';

export interface ITelegramOptions {
	botToken: string;
	chatId: string;
}

export interface ModuleTelegramOptions extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (...args: any[]) => Promise<ITelegramOptions> | ITelegramOptions;
	inject?: any[];
}
