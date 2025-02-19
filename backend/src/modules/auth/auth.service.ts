import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type Response } from 'express';
import { type Role } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { SessionService } from '../session/session.service';
import { type EnvConfig } from '../../common/interfaces/env-config';
import { computeHash, encrypt } from '../../common/helpers/bcrypt.helpers';
import { MESSAGES } from '../../common/constants/messages';
import { CLIENT_MAP } from '../../common/constants/client-map';

@Injectable()
export class AuthService {
    public readonly REFRESH_TOKEN_KEY = 'fj4me-refresh-token';
    private readonly CONFIRMATION_TOKEN_EXPIRES_MS = 24 * 60 * 60 * 1000;
    private readonly RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000;

    private readonly ACCESS_TOKEN_EXPIRES = '15m';
    private readonly REFRESH_TOKEN_EXPIRES = '7d';
    private readonly REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly sessionService: SessionService,
        private readonly configService: ConfigService<EnvConfig>,
    ) {
    }

    /**
     * Регистрирует нового пользователя, генерирует токен подтверждения и отправляет письмо для подтверждения регистрации.
     * @param email Электронная почта пользователя.
     * @param password Пароль пользователя.
     * @param role Роль пользователя ('STUDENT' или 'EMPLOYER').
     * @returns Созданного пользователя.
     */
    public async register(email: string, password: string, role: Role) {
        const existingUser = await this.prisma.user.findUnique({ where: { email: email } });

        if (existingUser) {
            throw new ConflictException(MESSAGES.USER_ALREADY_EXIST);
        }

        return this.prisma.$transaction(async (prisma) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const token = randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + this.CONFIRMATION_TOKEN_EXPIRES_MS);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                    isEmailConfirmed: false,
                    confirmationToken: token,
                    confirmationExpiresAt: expiresAt,
                },
            });

            const host = this.configService.get<string>('HOST');
            const port = this.configService.get<string>('PORT');
            const protocol = this.configService.get<boolean>('SSL') ? 'https' : 'http';
            const confirmationLink = `${protocol}://${host}:${port}/auth/confirm?token=${token}`;

            await this.mailerService.sendConfirmationEmail(email, confirmationLink);

            return user;
        });
    }

    /**
     * Подтверждает email пользователя по переданному токену.
     * @param token Токен подтверждения.
     * @returns Обновлённого пользователя с подтверждённым email.
     * @throws UnauthorizedException, если токен недействителен или истёк.
     */
    public async confirmEmail(token: string) {
        const user = await this.prisma.user.findFirst({ where: { confirmationToken: token } });
        if (!user) {
            throw new UnauthorizedException(MESSAGES.CONFIRMATION_INVALID);
        }
        if (user.confirmationExpiresAt && new Date() > user.confirmationExpiresAt) {
            throw new UnauthorizedException(MESSAGES.CONFIRMATION_EXPIRED);
        }

        return this.prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailConfirmed: true,
                confirmationToken: null,
                confirmationExpiresAt: null,
            },
        });
    }

    /**
     * Проверяет учетные данные пользователя.
     * @param email Электронная почта.
     * @param password Пароль.
     * @returns Объект пользователя без поля password или null, если проверка не пройдена.
     * @throws UnauthorizedException, если email не подтвержден.
     */
    public async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email: email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.confirmationExpiresAt && user.confirmationExpiresAt < new Date()) {
                const token = randomBytes(32).toString('hex');
                const host = this.configService.get<string>('HOST');
                const port = this.configService.get<string>('PORT');
                const protocol = this.configService.get<boolean>('SSL') ? 'https' : 'http';
                const confirmationLink = `${protocol}://${host}:${port}/auth/confirm?token=${token}`;

                await this.mailerService.sendConfirmationEmail(email, confirmationLink);

                throw new UnauthorizedException(MESSAGES.EMAIL_CONFIRMATION_RESENT);
            }

            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    /**
     * Запрашивает сброс пароля для пользователя, генерируя токен сброса и отправляя письмо с инструкциями.
     * @param email Электронная почта пользователя.
     * @returns Объект с сообщением об отправке инструкций.
     * @throws UnauthorizedException, если пользователь с таким email не найден.
     */
    public async requestPasswordReset(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        }
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + this.RESET_TOKEN_EXPIRES_MS);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: expiresAt,
            },
        });
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        const resetLink = `${frontendUrl + CLIENT_MAP.AUTH.RESET_PASSWORD.ROOT}?${CLIENT_MAP.AUTH.RESET_PASSWORD.TOKEN_QUERY}=${token}`;

        await this.mailerService.sendPasswordResetEmail(email, resetLink);
    }

    /**
     * Сбрасывает пароль пользователя по переданному токену сброса.
     * @param token Токен сброса пароля.
     * @param newPassword Новый пароль.
     * @returns Объект с сообщением об успешном изменении пароля.
     * @throws UnauthorizedException, если токен недействителен или истёк.
     */
    public async resetPassword(token: string, newPassword: string) {
        const user = await this.prisma.user.findFirst({ where: { resetPasswordToken: token } });
        if (!user) {
            throw new UnauthorizedException(MESSAGES.PASSWORD_RESET_INVALID_TOKEN);
        }
        if (user.resetPasswordExpiresAt && new Date() > user.resetPasswordExpiresAt) {
            throw new UnauthorizedException(MESSAGES.PASSWORD_RESET_EXPIRED);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiresAt: null,
            },
        });
        await this.revokeUserSessions(user.id);
    }

    /**
     * Удаляет все сессии для указанного пользователя.
     *
     * @param userId - Идентификатор пользователя, сессии которого необходимо удалить.
     */
    public async revokeUserSessions(userId: number) {
        await this.prisma.session.deleteMany({
            where: { userId },
        });
    }

    /**
     * Выполняет вход пользователя, генерирует accessToken и refreshToken, шифрует refreshToken, сохраняет сессию с дополнительными метаданными.
     * Ограничивает количество активных сессий до 5.
     * @param user Объект пользователя.
     * @param ip IP-адрес (опционально).
     * @param userAgent User-Agent (опционально).
     * @param location Геолокация (опционально).
     * @param device Информация об устройстве (опционально).
     * @returns Объект с accessToken и refreshToken.
     */
    public async login(
        user: any,
        ip?: string,
        userAgent?: string,
        location?: string,
        device?: string,
    ) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: this.ACCESS_TOKEN_EXPIRES });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: this.REFRESH_TOKEN_EXPIRES });

        await this.sessionService.createSession(user, refreshToken, ip, userAgent, location, device);

        return { accessToken, refreshToken };
    }

    /**
     * Обновляет refreshToken: проверяет старый, генерирует новые токены, шифрует новый refreshToken и обновляет сессию.
     * @param oldRefreshToken Старый refreshToken (не зашифрованный).
     * @returns Объект с новым accessToken и refreshToken.
     * @throws UnauthorizedException, если refreshToken недействителен или истёк.
     */
    public async refreshToken(oldRefreshToken: string) {
        const tokenHash = computeHash(oldRefreshToken);
        const session = await this.prisma.session.findUnique({ where: { tokenHash } });
        if (!session) {
            throw new UnauthorizedException(MESSAGES.REFRESH_TOKEN_INVALID);
        }
        if (new Date() > session.expiresAt) {
            await this.prisma.session.delete({ where: { id: session.id } });
            throw new UnauthorizedException(MESSAGES.REFRESH_TOKEN_EXPIRED);
        }
        const secret = this.configService.get<string>('JWT_SECRET');
        const newPayload = this.jwtService.verify(oldRefreshToken, { secret });
        const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: this.ACCESS_TOKEN_EXPIRES });
        const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: this.REFRESH_TOKEN_EXPIRES });
        const newExpiresAt = new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES_MS);
        const { iv: newIv, encryptedData: newEncryptedData } = encrypt(newRefreshToken);
        const newTokenHash = computeHash(newRefreshToken);
        await this.prisma.session.update({
            where: { id: session.id },
            data: {
                encryptedRefreshToken: newEncryptedData,
                tokenIv: newIv,
                tokenHash: newTokenHash,
                expiresAt: newExpiresAt,
            },
        });
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    /**
     * Устанавливает refreshToken в httpOnly cookie.
     * @param refreshToken Новый refreshToken.
     * @param res Объект ответа Express.
     */
    public setRefreshTokenFromCookie(refreshToken: string, res: Response) {
        res.cookie(this.REFRESH_TOKEN_KEY, refreshToken, {
            httpOnly: true,
            domain: this.configService.get<string>('DOMAIN'),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: this.REFRESH_TOKEN_EXPIRES_MS,
        });
    }

    /**
     * Выполняет выход пользователя, удаляя сессию по refreshToken.
     * @param refreshToken RefreshToken, который необходимо удалить.
     * @returns Объект с сообщением об успешном выходе.
     */
    public async logout(refreshToken: string) {
        const tokenHash = computeHash(refreshToken);
        await this.prisma.session.deleteMany({
            where: { tokenHash },
        });
    }

    /**
     * Выполняет выход пользователя, удаляя все сессии по userId.
     * @param userId UserId для удаления всех токенов
     * @returns Объект с сообщением об успешном выходе.
     */
    public async logoutAll(userId: number) {
        await this.prisma.session.deleteMany({
            where: { userId },
        });
    }
}

