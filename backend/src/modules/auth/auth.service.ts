import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type Response } from 'express';
import { type User } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { SessionService } from '../session/session.service';
import { type EnvConfig } from '../../common/interfaces/env-config';
import { computeHash, encrypt } from '../../common/helpers/bcrypt.helpers';
import { MESSAGES } from '../../common/constants/messages';
import { CLIENT_MAP } from '../../common/constants/client-map';
import { API_PREFIX } from '../../common/constants/common';
import { IAuthenticatedUser } from './interfaces/authenticated-user.interface';

@Injectable()
export class AuthService {
    public readonly REFRESH_TOKEN_KEY = 'fj4me-refresh-token';
    private readonly CONFIRMATION_TOKEN_EXPIRES_MS = 24 * 60 * 60 * 1000;
    private readonly RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000;
    private readonly LOGIN_CODE_EXPIRES_MS = 5 * 60 * 1000;

    private readonly ACCESS_TOKEN_EXPIRES = '15m';
    private readonly REFRESH_TOKEN_EXPIRES = '7d';
    private readonly REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly sessionService: SessionService,
        private readonly configService: ConfigService<EnvConfig>,
    ) {}

    /**
     * Регистрирует нового пользователя, генерирует токен подтверждения и отправляет письмо для подтверждения регистрации.
     * @param email Электронная почта пользователя.
     * @param password Пароль пользователя.
     * @returns Созданного пользователя.
     */
    public async register(email: string, password: string) {
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
                    isEmailConfirmed: false,
                    confirmationToken: token,
                    confirmationExpiresAt: expiresAt,
                },
            });

            const baseurl = this.configService.get<string>('BASE_URL');
            const confirmationLink = `${baseurl}/${API_PREFIX}/auth/confirm?token=${token}`;

            await this.mailerService.sendConfirmationEmail(email, confirmationLink);

            return user;
        });
    }

    /**
     * Подтверждает email пользователя по переданному токену.
     * @param token Токен подтверждения.
     * @returns Обновлённого пользователя с подтверждённым email.
     * @throws ForbiddenException, если токен недействителен или истёк.
     */
    public async confirmEmail(token: string) {
        const user = await this.prisma.user.findFirst({ where: { confirmationToken: token } });
        if (!user) {
            throw new ForbiddenException(MESSAGES.CONFIRMATION_INVALID);
        }
        if (user.confirmationExpiresAt && new Date() > user.confirmationExpiresAt) {
            throw new ForbiddenException(MESSAGES.CONFIRMATION_EXPIRED);
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
     * @throws ForbiddenException, если email не подтвержден.
     */
    public async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        }
        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isEmailConfirmed && user.confirmationExpiresAt && user.confirmationExpiresAt < new Date()) {
                const token = randomBytes(32).toString('hex');

                const baseurl = this.configService.get<string>('BASE_URL');
                const confirmationLink = `${baseurl}/${API_PREFIX}/auth/confirm?token=${token}`;

                await this.mailerService.sendConfirmationEmail(email, confirmationLink);

                throw new ForbiddenException(MESSAGES.EMAIL_CONFIRMATION_RESENT);
            }
        }

        return user.email;
    }

    /**
     * Запрашивает сброс пароля для пользователя, генерируя токен сброса и отправляя письмо с инструкциями.
     * @param email Электронная почта пользователя.
     * @returns Объект с сообщением об отправке инструкций.
     * @throws ForbiddenException, если пользователь с таким email не найден.
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

        if (user.resetPasswordExpiresAt && user.resetPasswordExpiresAt < new Date()) {
            await this.mailerService.sendPasswordResetEmail(email, resetLink);
            return;
        }

        throw new ConflictException(MESSAGES.PASSWORD_RESET_EMAIL_ALREADY_SEND);
    }

    /**
     * Сбрасывает пароль пользователя по переданному токену сброса.
     * @param token Токен сброса пароля.
     * @param newPassword Новый пароль.
     * @returns Объект с сообщением об успешном изменении пароля.
     * @throws ForbiddenException, если токен недействителен или истёк.
     */
    public async resetPassword(token: string, newPassword: string) {
        const user = await this.prisma.user.findFirst({ where: { resetPasswordToken: token } });
        if (!user) {
            throw new ForbiddenException(MESSAGES.PASSWORD_RESET_INVALID_TOKEN);
        }
        if (user.resetPasswordExpiresAt && new Date() > user.resetPasswordExpiresAt) {
            throw new ForbiddenException(MESSAGES.PASSWORD_RESET_EXPIRED);
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
     * Запрашивает код для входа.
     * Генерирует 6-значный код, устанавливает время истечения (5 минут),
     * сохраняет их в базе данных и отправляет код на email.
     *
     * @param {string} email - Электронная почта пользователя.
     * @throws {NotFoundException} Если пользователь с данным email не найден.
     */
    public async requestLoginCode(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        }
        if (user.loginCode && user.loginCodeExpiresAt && user.loginCodeExpiresAt > new Date()) {
            return;
        }
        const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + this.LOGIN_CODE_EXPIRES_MS);

        await this.prisma.user.update({
            where: { email },
            data: {
                loginCode,
                loginCodeExpiresAt: expiresAt,
            },
        });

        await this.mailerService.sendLoginCode(email, loginCode);
    }

    /**
     * Проверяет код для входа.
     * Сравнивает переданный код с сохраненным в базе данных и проверяет срок его действия.
     * Если код корректный и не истек, очищает поля кода и выполняет вход пользователя.
     *
     * @param {string} email - Электронная почта пользователя.
     * @param {string} code - Код для входа, введённый пользователем.
     * @throws {NotFoundException} Если пользователь с данным email не найден.
     * @throws {ForbiddenException} Если код неверный или срок его действия истёк.
     */
    public async verifyLoginCode(email: string, code: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        }
        if (user.loginCode !== code) {
            throw new ForbiddenException(MESSAGES.CODE_INVALID);
        }
        if (user.loginCodeExpiresAt && new Date() > user.loginCodeExpiresAt) {
            throw new ForbiddenException(MESSAGES.CODE_EXPIRED);
        }

        await this.prisma.user.update({
            where: { email },
            data: {
                loginCode: null,
                loginCodeExpiresAt: null,
            },
        });

        return this.login(user);
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
        user: User,
        ip?: string,
        userAgent?: string,
        location?: string,
        device?: string,
    ) {
        const payload: IAuthenticatedUser = { email: user.email, userId: user.id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: this.ACCESS_TOKEN_EXPIRES });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: this.REFRESH_TOKEN_EXPIRES });

        await this.sessionService.createSession(user, refreshToken, ip, userAgent, location, device);

        return { accessToken, refreshToken };
    }

    /**
     * Обновляет refreshToken: проверяет старый, генерирует новые токены, шифрует новый refreshToken и обновляет сессию.
     * @param oldRefreshToken Старый refreshToken (не зашифрованный).
     * @returns Объект с новым accessToken и refreshToken.
     * @throws ForbiddenException, если refreshToken недействителен или истёк.
     */
    public async refreshToken(oldRefreshToken: string) {
        const tokenHash = computeHash(oldRefreshToken);
        const session = await this.prisma.session.findUnique({ where: { tokenHash } });
        if (!session) {
            throw new ForbiddenException(MESSAGES.REFRESH_TOKEN_INVALID);
        }
        if (new Date() > session.expiresAt) {
            await this.prisma.session.delete({ where: { id: session.id } });
            throw new ForbiddenException(MESSAGES.REFRESH_TOKEN_EXPIRED);
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
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie(this.REFRESH_TOKEN_KEY, refreshToken, {
            httpOnly: true,
            domain: isProduction ? this.configService.get<string>('DOMAIN') : undefined,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
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
}

