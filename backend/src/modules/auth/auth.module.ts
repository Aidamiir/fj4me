import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { GosuslugiStrategy } from './strategies/gosuslugi.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GosuslugiAuthController } from './gosuslugi-auth.controller';
import { SessionModule } from '../session/session.module';
import { type EnvConfig } from '../../common/interfaces/env-config';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<EnvConfig>) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
        }),
        SessionModule,
    ],
    providers: [AuthService, JwtStrategy, GosuslugiStrategy],
    controllers: [AuthController, GosuslugiAuthController],
})
export class AuthModule {}