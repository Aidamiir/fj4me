import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';

import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { type IAuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    /**
     * Получает историю сообщений между аутентифицированным пользователем и другим пользователем.
     */
    @UseGuards(JwtAuthGuard)
    @Get('messages/:otherUserId')
    public async getMessagesBetweenUsers(
        @Req() req: Request,
        @Param('otherUserId') otherUserId: string,
    ) {
        const user = req.user as IAuthenticatedUser;
        return this.chatService.getMessagesBetweenUsers(user.userId, Number(otherUserId));
    }
}