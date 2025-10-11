import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from '../telegram/interfaces/telegram.interface';

export const getTelegramConfig = (configService: ConfigService): ITelegramOptions => {
	const botToken = configService.get<string>('TELEGRAM_BOT_TOKEN');
	if (!botToken) {
		throw new Error('TELEGRAM_BOT_TOKEN is not set');
	}
	return {
		botToken,
		chatId: configService.get<string>('TELEGRAM_CHAT_ID') ?? '',
	};
};
