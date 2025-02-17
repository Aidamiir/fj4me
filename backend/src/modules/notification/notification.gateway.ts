import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN.split(',')[0] } })
export class NotificationGateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    /**
     * Обрабатывает подключение нового клиента.
     */
    public handleConnection(client: Socket): void {
        const userId = client.handshake.query.userId as string;
        if (userId) {
            client.join(`user_${userId}`);
        }
    }

    /**
     * Отправляет уведомление конкретному пользователю.
     *
     * Отправка осуществляется через emit в комнату, соответствующую идентификатору пользователя.
     */
    public sendNotification(userId: number, notification: any): void {
        this.server.to(`user_${userId}`).emit('newNotification', notification);
    }
}