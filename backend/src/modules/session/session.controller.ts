import { Controller, Get, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';

import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { type IAuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    /**
     * Возвращает список активных сессий текущего пользователя.
     */
    @Get()
    public async getSessions(@Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.sessionService.getSessionsByUser(user.userId);
    }

    /**
     * Завершает сессию по её идентификатору.
     */
    @Delete(':id')
    public async deleteSession(@Param('id') id: string, @Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.sessionService.deleteSession(parseInt(id, 10), user.userId);
    }
}