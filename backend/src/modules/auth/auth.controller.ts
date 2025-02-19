import { Controller, Post, Body, UnauthorizedException, Req, Res, UseGuards, Query, Get } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MESSAGES } from '../../common/constants/messages';
import type { IAuthenticatedUser } from './interfaces/authenticated-user.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
    public async confirmEmail(@Query('token') token: string) {
        await this.authService.confirmEmail(token);
    }

    /**
     * Выполняет вход пользователя после проверки учетных данных и подтверждения email.
     */
    @Post('login')
    public async login(
        @Body() body: AuthLoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException(MESSAGES.LOGIN_FAILURE);
        }
        const { refreshToken, ...response } = await this.authService.login(user);
        this.authService.setRefreshTokenFromCookie(refreshToken, res);
        return response;
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
    @UseGuards(JwtAuthGuard)
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