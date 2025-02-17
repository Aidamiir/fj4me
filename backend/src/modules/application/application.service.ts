import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MESSAGES } from '../../common/constants/messages';

@Injectable()
export class ApplicationService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Создает новый отклик, связывая резюме с вакансией.
     * @param resumeId Идентификатор резюме.
     * @param vacancyId Идентификатор вакансии.
     * @param userId Идентификатор пользователя (владельца резюме).
     * @returns Созданный отклик.
     */
    public async createApplication(resumeId: number, vacancyId: number, userId: number) {
        const resume = await this.prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume) throw new NotFoundException(MESSAGES.RESUME_NOT_FOUND);
        if (resume.userId !== userId) throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
        return this.prisma.application.create({
            data: {
                resume: { connect: { id: resumeId } },
                vacancy: { connect: { id: vacancyId } },
                status: 'pending',
            },
        });
    }

    /**
     * Получает отклики для вакансии работодателя.
     * @param vacancyId Идентификатор вакансии.
     * @param userId Идентификатор работодателя.
     * @returns Список откликов с включением данных резюме.
     */
    public async getApplicationsForVacancy(vacancyId: number, userId: number) {
        const vacancy = await this.prisma.vacancy.findUnique({ where: { id: vacancyId } });
        if (!vacancy) throw new NotFoundException(MESSAGES.VACANCY_NOT_FOUND);
        if (vacancy.userId !== userId) throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
        return this.prisma.application.findMany({
            where: { vacancyId },
            include: { resume: true },
        });
    }

    /**
     * Получает отклики, поданные текущим пользователем.
     * @param userId Идентификатор пользователя.
     * @returns Список откликов с включением данных вакансии.
     */
    public async getApplicationsByUser(userId: number) {
        return this.prisma.application.findMany({
            where: { resume: { userId } },
            include: { vacancy: true },
        });
    }

    /**
     * Обновляет статус отклика (например, принимает или отклоняет).
     * @param applicationId Идентификатор отклика.
     * @param status Новый статус отклика.
     * @param userId Идентификатор работодателя.
     * @returns Обновленный отклик.
     */
    public async updateApplicationStatus(applicationId: number, status: string, userId: number) {
        const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
        if (!application) throw new NotFoundException(MESSAGES.APPLICATION_NOT_FOUND);
        const vacancy = await this.prisma.vacancy.findUnique({ where: { id: application.vacancyId } });
        if (vacancy.userId !== userId) throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
        return this.prisma.application.update({
            where: { id: applicationId },
            data: { status },
        });
    }
}