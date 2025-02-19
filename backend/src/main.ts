import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './modules/app.module';
import { configureCors } from './common/config/configure-cors';
import { configurePipes } from './common/config/configure-pipes';
import { configureSwagger, swaggerPrefix } from './common/config/configure-swagger';
import { ResponseTransformInterceptor } from './common/interceptor/response-transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exception-filter';
import { type EnvConfig } from './common/interfaces/env-config';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    const app = await NestFactory.create(AppModule);
    const configService = app.get<ConfigService<EnvConfig>>(ConfigService);
    const port = configService.get<number>('PORT')!;
    const host = configService.get<string>('HOST')!;

    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.use(helmet());
    configurePipes(app);
    configureCors(app, configService);
    configureSwagger(app);

    await app.listen(port, host);

    logger.log(`API started on: http://localhost:${port}`);
    logger.log(`SWAGGER started on: http://localhost:${port}/${swaggerPrefix}`);
}

bootstrap();