import { type INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Конфигурирует глобальные валидационные пайпы для Nest.js.
 * @param {INestApplication} app - Экземпляр Nest.js
 */
export const configurePipes = (app: INestApplication) => {
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            stopAtFirstError: true,
        }),
    );
};
