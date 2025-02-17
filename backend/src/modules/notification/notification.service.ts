import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';
import { MESSAGES } from '../../common/constants/messages';

@Injectable()
export class NotificationService {
    constructor(
        private prisma: PrismaService,
        private notificationGateway: NotificationGateway,
    ) {}

    /**
     * Создает уведомление для указанного пользователя и отправляет его через WebSocket.
     *
     * @param userId - Идентификатор пользователя, для которого создается уведомление.
     * @param content - Содержимое уведомления.
     * @returns Созданное уведомление.
     */
    public async createNotification(userId: number, content: string) {
        const notification = await this.prisma.notification.create({
            data: {
                user: { connect: { id: userId } },
                content,
            },
        });
        this.notificationGateway.sendNotification(userId, notification);
        return notification;
    }

    /**
     * Получает список уведомлений для указанного пользователя.
     *
     * @param userId - Идентификатор пользователя, уведомления которого необходимо получить.
     * @returns Массив уведомлений, отсортированных по дате создания в порядке убывания.
     */
    public async getNotifications(userId: number) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Отмечает уведомление как прочитанное для пользователя.
     *
     * @param notificationId - Идентификатор уведомления, которое необходимо отметить как прочитанное.
     * @param userId - Идентификатор пользователя, который пытается отметить уведомление как прочитанное.
     * @returns Обновленное уведомление с установленным флагом isRead.
     * @throws Error если уведомление не найдено или не принадлежит указанному пользователю.
     */
    public async markAsRead(notificationId: number, userId: number) {
        const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
        if (!notification || notification.userId !== userId) {
            throw new Error(MESSAGES.ACCESS_DENIED);
        }
        return this.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
}