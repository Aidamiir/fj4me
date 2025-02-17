import { ConfigService } from '@nestjs/config';
import { type INestApplication } from '@nestjs/common';

import { type EnvConfig } from '../interfaces/env-config';

/**
 * Конфигурирует CORS (Cross-Origin Resource Sharing).
 * @param {INestApplication} app - Экземпляр Nest.js
 * @param {ConfigService} configService - Сервис конфигурации для получения переменных окружения
 */
export const configureCors = (app: INestApplication, configService: ConfigService<EnvConfig>) => {
    if (process.env.NODE_ENV === 'development') return;

    const corsOrigin = configService.get<string>('CORS_ORIGIN');
    const formattedCorsOrigins = corsOrigin.split(',').map((origin) => origin.trim());

    app.enableCors({
        origin: formattedCorsOrigins,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['POST', 'OPTIONS'],
    });
};
