import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    /**
     * Отправляет сообщение от одного пользователя к другому.
     *
     * @param senderId - Идентификатор пользователя, отправляющего сообщение.
     * @param receiverId - Идентификатор пользователя, получающего сообщение.
     * @param content - Текст сообщения.
     * @returns Объект созданного сообщения.
     */
    public async sendMessage(senderId: number, receiverId: number, content: string) {
        return this.prisma.chatMessage.create({
            data: {
                sender: { connect: { id: senderId } },
                receiver: { connect: { id: receiverId } },
                content,
            },
        });
    }

    /**
     * Получает все сообщения между двумя пользователями, отсортированные по дате создания в порядке возрастания.
     *
     * @param userId - Идентификатор первого пользователя.
     * @param otherUserId - Идентификатор второго пользователя.
     * @returns Массив сообщений, где каждое сообщение содержит данные об отправителе, получателе и содержимом.
     */
    public async getMessagesBetweenUsers(userId: number, otherUserId: number) {
        return this.prisma.chatMessage.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
    }
}