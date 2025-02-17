import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { Module } from '@nestjs/common';

import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ResumeModule } from './resume/resume.module';
import { MailerModule } from './mailer/mailer.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { SessionModule } from './session/session.module';
import { ApplicationModule } from './application/application.module';
import { NotificationModule } from './notification/notification.module';
import { validationSchema } from '../common/config/validation-schema';
import { type EnvConfig } from '../common/interfaces/env-config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema,
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService<EnvConfig>) => ({
                throttlers: [{
                    ttl: configService.get<number>('THROTTLER_LIMIT_SECONDS'),
                    limit: configService.get<number>('THROTTLER_LIMIT_QUERIES'),
                }],
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        ChatModule,
        UsersModule,
        MailerModule,
        ResumeModule,
        SessionModule,
        VacancyModule,
        ApplicationModule,
        NotificationModule,
    ],
})
export class AppModule {}