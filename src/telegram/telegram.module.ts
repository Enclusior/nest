import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ModuleTelegramOptions } from './interfaces/telegram.interface';
import { TELEGRAM_OPTIONS } from './telegram.constant';

@Global()
@Module({})
export class TelegramModule {
	static forRootAsync(options: ModuleTelegramOptions): DynamicModule {
		const asyncOptions = this.createAsyncOptionsProviders(options);
		return {
			module: TelegramModule,
			imports: options.imports,
			providers: [TelegramService, asyncOptions],
			exports: [TelegramService],
		};
	}

	private static createAsyncOptionsProviders(options: ModuleTelegramOptions): Provider {
		return {
			provide: TELEGRAM_OPTIONS,
			useFactory: async (...args: unknown[]) => {
				const config = await Promise.resolve(options.useFactory(...args));
				return config;
			},
			inject: options.inject || [],
		};
	}
}
