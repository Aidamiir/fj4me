import { Controller, Post, Body, UseGuards, Req, Get, Param, Put } from '@nestjs/common';
import { type Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { type IAuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('applications')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {}

    /**
     * Создает новый отклик, связывая резюме с вакансией.
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    public async createApplication(
        @Body() body: CreateApplicationDto,
        @Req() req: Request,
    ) {
        const user = req.user as IAuthenticatedUser;
        return this.applicationService.createApplication(body.resumeId, body.vacancyId, user.userId);
    }

    /**
     * Получает отклики для вакансии работодателя.
     */
    @UseGuards(JwtAuthGuard)
    @Get('vacancy/:vacancyId')
    public async getApplicationsForVacancy(@Param('vacancyId') vacancyId: string, @Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.applicationService.getApplicationsForVacancy(parseInt(vacancyId), user.userId);
    }

    /**
     * Получает отклики, поданные текущим пользователем.
     */
    @UseGuards(JwtAuthGuard)
    @Get('my')
    public async getApplicationsByUser(@Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.applicationService.getApplicationsByUser(user.userId);
    }

    /**
     * Обновляет статус отклика.
     */
    @UseGuards(JwtAuthGuard)
    @Put(':applicationId')
    public async updateApplicationStatus(
        @Param('applicationId') applicationId: string,
        @Body() body: UpdateApplicationDto,
        @Req() req: Request,
    ) {
        const user = req.user as IAuthenticatedUser;
        return this.applicationService.updateApplicationStatus(parseInt(applicationId), body.status, user.userId);
    }
}