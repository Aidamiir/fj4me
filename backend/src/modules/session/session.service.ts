import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { type User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { computeHash, encrypt } from '../../common/helpers/bcrypt.helpers';
import { MESSAGES } from '../../common/constants/messages';

@Injectable()
export class SessionService {
    private readonly MAX_SESSIONS = 5;

    constructor(private readonly prisma: PrismaService) {}

    /**
     * Возвращает список активных сессий для указанного пользователя.
     * @param userId Идентификатор пользователя.
     * @returns Список сессий.
     */
    public async getSessionsByUser(userId: number) {
        return this.prisma.session.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Завершает (удаляет) сессию по её идентификатору, если она принадлежит указанному пользователю.
     * @param sessionId Идентификатор сессии.
     * @param userId Идентификатор пользователя.
     * @returns Удаленную сессию.
     * @throws NotFoundException, если сессия не найдена.
     * @throws ForbiddenException, если сессия не принадлежит пользователю.
     */
    public async deleteSession(sessionId: number, userId: number) {
        const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
        if (!session) {
            throw new NotFoundException(MESSAGES.SESSION_NOT_FOUND);
        }
        if (session.userId !== userId) {
            throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
        }
        return this.prisma.session.delete({ where: { id: sessionId } });
    }

    /**
     * Создает новую сессию для пользователя, шифруя refreshToken и ограничивая максимальное количество сессий.
     *
     * @param user - Объект пользователя.
     * @param refreshToken - Refresh токен, который необходимо зашифровать и сохранить.
     * @param ip - IP-адрес пользователя (опционально).
     * @param userAgent - User-Agent запроса (опционально).
     * @param location - Геолокация (опционально).
     * @param device - Информация об устройстве (опционально).
     */
    public async createSession(
        user: User,
        refreshToken: string,
        ip?: string,
        userAgent?: string,
        location?: string,
        device?: string,
    ) {
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const { iv, encryptedData } = encrypt(refreshToken);
        const tokenHash = computeHash(refreshToken);

        const sessions = await this.prisma.session.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'asc' },
        });
        if (sessions.length >= this.MAX_SESSIONS) {
            await this.prisma.session.delete({ where: { id: sessions[0].id } });
        }
        await this.prisma.session.create({
            data: {
                userId: user.id,
                encryptedRefreshToken: encryptedData,
                tokenIv: iv,
                tokenHash,
                expiresAt,
                ip: ip || null,
                userAgent: userAgent || null,
                location: location || null,
                device: device || null,
            },
        });
    }
}