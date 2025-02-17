import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN.split(',')[0] } })
export class ChatGateway implements OnGatewayConnection {
    constructor(private readonly chatService: ChatService) {}

    /**
     * Обрабатывает подключение нового клиента.
     * Если в запросе присутствует параметр `userId`, клиент добавляется в соответствующую комнату.
     *
     * @param client - Экземпляр Socket, представляющий подключенного клиента.
     */
    public handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (userId) {
            client.join(`user_${userId}`);
        }
    }

    /**
     * Обрабатывает входящее сообщение и отправляет его получателю.
     * Сообщение отправляется через ChatService, затем транслируется в комнату получателя.
     *
     * @param data - Объект, содержащий идентификаторы отправителя и получателя, а также текст сообщения.
     * @param client - Клиент Socket, отправивший сообщение.
     * @returns Объект с событием 'messageSent' и данными отправленного сообщения.
     */
    @SubscribeMessage('sendMessage')
    public async handleSendMessage(@MessageBody() data: MessageDto, @ConnectedSocket() client: Socket) {
        const message = await this.chatService.sendMessage(
            data.senderId,
            data.receiverId,
            data.content,
        );

        client.to(`user_${data.receiverId}`).emit('newMessage', message);
        return { event: 'messageSent', data: message };
    }
}