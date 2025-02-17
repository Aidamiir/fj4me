import { Controller, Post, Body, Put, Param, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';

import { VacancyService } from './vacancy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import type { IAuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('vacancies')
export class VacancyController {
    constructor(private vacancyService: VacancyService) {}

    /**
     * Создает новую вакансию.
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    public async createVacancy(@Body() body: CreateVacancyDto, @Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.vacancyService.createVacancy(user.userId, body.title, body.description);
    }

    /**
     * Обновляет вакансию.
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    public async updateVacancy(@Param('id') id: string, @Body() body: UpdateVacancyDto, @Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.vacancyService.updateVacancy(user.userId, parseInt(id), body.title, body.description);
    }

    /**
     * Удаляет вакансию.
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deleteVacancy(@Param('id') id: string, @Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.vacancyService.deleteVacancy(user.userId, parseInt(id));
    }

    /**
     * Получает вакансии, созданные текущим работодателем.
     */
    @UseGuards(JwtAuthGuard)
    @Get('my')
    public async getMyVacancies(@Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.vacancyService.getVacanciesByUser(user.userId);
    }

    /**
     * Получает все вакансии.
     */
    @Get()
    public async getAllVacancies() {
        return this.vacancyService.getAllVacancies();
    }
}