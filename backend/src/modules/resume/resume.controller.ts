import { Controller, Post, Body, Put, Param, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';

import { ResumeService } from './resume.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { CreateResumeDto } from './dto/create-resume.dto';
import { type IAuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('resumes')
export class ResumeController {
    constructor(private resumeService: ResumeService) {}

    /**
     * Создает новое резюме.
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    public async createResume(@Body() body: CreateResumeDto, @Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.resumeService.createResume(user.userId, body.title, body.content);
    }

    /**
     * Обновляет резюме.
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    public async updateResume(@Param('id') id: string, @Body() body: UpdateResumeDto, @Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.resumeService.updateResume(user.userId, parseInt(id), body.title, body.content);
    }

    /**
     * Удаляет резюме.
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deleteResume(@Param('id') id: string, @Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.resumeService.deleteResume(user.userId, parseInt(id));
    }

    /**
     * Получает резюме пользователя.
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    public async getResumes(@Req() req: Request) {
        const user = req.user as IAuthenticatedUser;
        return this.resumeService.getResumesByUser(user.userId);
    }
}