import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { type INestApplication } from '@nestjs/common';

export const swaggerPrefix = 'api-docs';

/**
 * Конфигурирует и настраивает Swagger-документацию для API.
 * @param {INestApplication} app - Экземпляр Nest.js
 */
export const configureSwagger = (app: INestApplication) => {
    if (process.env.NODE_ENV === 'production') return;

    const config = new DocumentBuilder()
        .setTitle('FJ4ME API')
        .setDescription('API для платформы поиска работы/стажировок')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: false });
    SwaggerModule.setup(swaggerPrefix, app, document);
};
