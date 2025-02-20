import {
    Controller,
    Post,
    Body,
    Req,
    Res,
    UseGuards,
    Query,
    Get,
    UnauthorizedException,
    ForbiddenException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthLoginCodeDto } from './dto/auth-login-code.dto';
import { MESSAGES } from '../../common/constants/messages';
import { CLIENT_MAP } from '../../common/constants/client-map';
import type { EnvConfig } from '../../common/interfaces/env-config';
import type { IAuthenticatedUser } from './interfaces/authenticated-user.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService<EnvConfig>,
    ) {}

    /**
     * Регистрирует нового пользователя и отправляет письмо с подтверждением.
     */
    @Post('register')
    public async register(@Body() body: AuthRegisterDto) {
        await this.authService.register(body.email, body.password, body.role);
    }

    /**
     * Подтверждает email пользователя по переданному токену.
     */
    @Get('confirm')
    public async confirmEmail(
        @Query('token') token: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        try {
            await this.authService.confirmEmail(token);
            return res.redirect(frontendUrl + CLIENT_MAP.AUTH.REGISTER.ROOT + `?${CLIENT_MAP.AUTH.REGISTER.CONFIRM_QUERY}=true`);
        }
        catch {
            return res.redirect(frontendUrl + CLIENT_MAP.AUTH.REGISTER.ROOT + `?${CLIENT_MAP.AUTH.REGISTER.CONFIRM_QUERY}=false`);
        }
    }

    /**
     * Шаг 1: Запрос кода для входа.
     * Проверяет email и пароль, а затем отправляет код на почту.
     * В случае успеха возвращается пустой объект, так как сообщение об успехе обрабатывается на фронте.
     */
    @Post('login/request-code')
    public async requestLoginCode(@Body() body: AuthLoginDto) {
        const email = await this.authService.validateUser(body.email, body.password);
        if (!email) {
            throw new ForbiddenException(MESSAGES.LOGIN_FAILURE);
        }
        await this.authService.requestLoginCode(email);
    }

    /**
     * Шаг 2: Подтверждение кода для входа.
     * Принимает email и код, проверяет его и, если всё верно, выполняет вход.
     * В случае успеха возвращаются токены (это необходимо для авторизации).
     */
    @Post('login/verify-code')
    public async verifyLoginCode(
        @Body() body: AuthLoginCodeDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } = await this.authService.verifyLoginCode(body.email, body.code);
        this.authService.setRefreshTokenFromCookie(refreshToken, res);
        return { accessToken };
    }

    /**
     * Обновляет accessToken с использованием refreshToken.
     */
    @Post('refresh')
    public async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.[this.authService.REFRESH_TOKEN_KEY];
        if (!refreshToken) {
            throw new UnauthorizedException(MESSAGES.REFRESH_TOKEN_MISSING);
        }
        const tokens = await this.authService.refreshToken(refreshToken);
        this.authService.setRefreshTokenFromCookie(tokens.refreshToken, res);
        return { accessToken: tokens.accessToken };
    }

    /**
     * Выполняет выход пользователя, удаляя сессию и очищая refresh token cookie.
     */
    @Post('logout')
    public async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.[this.authService.REFRESH_TOKEN_KEY];
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }
        res.clearCookie(this.authService.REFRESH_TOKEN_KEY);
    }

    /**
     * Выполняет выход пользователя, удаляя все сессии по userId.
     */
    @UseGuards(JwtAuthGuard)
    @Post('logout-all')
    public async logoutAll(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = req.user as IAuthenticatedUser;
        const refreshToken = req.cookies?.[this.authService.REFRESH_TOKEN_KEY];
        if (refreshToken && user.userId) {
            await this.authService.logoutAll(user.userId);
        }
        res.clearCookie(this.authService.REFRESH_TOKEN_KEY);
    }

    /**
     * Запрашивает сброс пароля для пользователя, генерируя токен сброса и отправляя письмо с инструкциями.
     */
    @Post('request-reset')
    public async requestPasswordReset(@Body() { email }: RequestResetDto) {
        return this.authService.requestPasswordReset(email);
    }

    /**
     * Выполняет сброс пароля пользователя по токену сброса.
     */
    @Post('reset-password')
    public async resetPassword(@Body() body: ResetPasswordDto) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }
}