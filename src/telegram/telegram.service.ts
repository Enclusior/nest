import { Inject, Injectable } from '@nestjs/common';
import { TELEGRAM_OPTIONS } from './telegram.constant';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './interfaces/telegram.interface';

@Injectable()
export class TelegramService {
	bot: Telegraf;
	options: ITelegramOptions;
	constructor(@Inject(TELEGRAM_OPTIONS) options: ITelegramOptions) {
		this.bot = new Telegraf(options.botToken);
		this.options = options;
	}
	async sendMessage(message: string, chatId: string = this.options.chatId): Promise<void> {
		await this.bot.telegram.sendMessage(chatId, message);
	}
}
