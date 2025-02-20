import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth/gosuslugi')
export class GosuslugiAuthController {
    /**
     * Перенаправляет пользователя на страницу авторизации Госуслуг.
     */
    @Get('login')
    @UseGuards(AuthGuard('gosuslugi'))
    public async gosuslugiLogin() {}

    /**
     * Обрабатывает callback от Госуслуг.
     */
    @Get('callback')
    @UseGuards(AuthGuard('gosuslugi'))
    public async gosuslugiCallback(@Req() req, @Res() res: Response) {
        console.log('Пользователь из gosuslugi', req.user);
    }
}