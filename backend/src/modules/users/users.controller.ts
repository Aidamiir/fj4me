import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { type IAuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    /**
     * Получает профиль аутентифицированного пользователя.
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    public async getProfile(@Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.usersService.getProfile(user.userId);
    }

    /**
     * Обновляет профиль аутентифицированного пользователя.
     */
    @UseGuards(JwtAuthGuard)
    @Put('profile')
    public async updateProfile(@Req() req: Request, @Body() body: UpdateProfileDto) {
        const user = req.user as IAuthenticatedUser;
        return this.usersService.updateProfile(user.userId, body.firstName, body.lastName, body.phone);
    }
}