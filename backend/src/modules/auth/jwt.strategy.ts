import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { type IAuthenticatedUser } from './interfaces/authenticated-user.interface';
import { type EnvConfig } from '../../common/interfaces/env-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService<EnvConfig>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    public async validate(payload: any): Promise<IAuthenticatedUser>  {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}