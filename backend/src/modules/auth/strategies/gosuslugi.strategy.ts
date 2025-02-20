import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as OAuth2Strategy, StrategyOptions } from 'passport-oauth2';
import { MESSAGES } from '../../../common/constants/messages';

@Injectable()
export class GosuslugiStrategy extends PassportStrategy(OAuth2Strategy, 'gosuslugi') {
    constructor(private configService: ConfigService) {
        const options: StrategyOptions = {
            authorizationURL: 'https://login.gosuslugi.ru/auth',
            tokenURL: 'https://login.gosuslugi.ru/token',
            clientID: configService.get<string>('GOSUSLUGI_CLIENT_ID'),
            clientSecret: configService.get<string>('GOSUSLUGI_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOSUSLUGI_REDIRECT_URI'),
            scope: 'openid',
        };
        super(options);
    }

    public async validate(accessToken: string, refreshToken: string, params: any, profile: any) {
        const response = await fetch('https://login.gosuslugi.ru/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
            throw new Error(MESSAGES.USER_GET_INFO_FAILED);
        }
        return await response.json();
    }
}