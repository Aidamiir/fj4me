import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { type IAuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('notifications')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    /**
     * Получает уведомления для аутентифицированного пользователя.
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getNotifications(@Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.notificationService.getNotifications(user.userId);
    }

    /**
     * Помечает уведомление как прочитанное для аутентифицированного пользователя.
     */
    @UseGuards(JwtAuthGuard)
    @Patch(':id/read')
    public async markAsRead(@Param('id') id: string, @Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.notificationService.markAsRead(parseInt(id, 10), user.userId);
    }
}