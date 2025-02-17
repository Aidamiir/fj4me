import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MESSAGES } from '../../common/constants/messages';

@Injectable()
export class VacancyService {
    constructor(private prisma: PrismaService) {}

    /**
     * Создает новую вакансию.
     *
     * @param userId Идентификатор пользователя, создающего вакансию.
     * @param title Заголовок вакансии.
     * @param description Описание вакансии.
     * @returns Объект созданной вакансии.
     */
    public async createVacancy(userId: number, title: string, description: string) {
        return this.prisma.vacancy.create({
            data: {
                title,
                description,
                user: { connect: { id: userId } },
            },
        });
    }

    /**
     * Обновляет существующую вакансию.
     *
     * @param userId Идентификатор пользователя, пытающегося обновить вакансию.
     * @param vacancyId Идентификатор вакансии, которую необходимо обновить.
     * @param title Новый заголовок вакансии (опционально).
     * @param description Новое описание вакансии (опционально).
     * @returns Обновленный объект вакансии.
     * @throws {NotFoundException} Если вакансия не найдена.
     * @throws {ForbiddenException} Если вакансия не принадлежит указанному пользователю.
     */
    public async updateVacancy(userId: number, vacancyId: number, title?: string, description?: string) {
        const vacancy = await this.prisma.vacancy.findUnique({ where: { id: vacancyId } });
        if (!vacancy) throw new NotFoundException(MESSAGES.VACANCY_NOT_FOUND);
        if (vacancy.userId !== userId) throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
        return this.prisma.vacancy.update({
            where: { id: vacancyId },
            data: { title, description },
        });
    }

    /**
     * Удаляет вакансию.
     *
     * @param userId Идентификатор пользователя, пытающегося удалить вакансию.
     * @param vacancyId Идентификатор вакансии, которую необходимо удалить.
     * @returns Объект удаленной вакансии.
     * @throws {NotFoundException} Если вакансия не найдена.
     * @throws {ForbiddenException} Если вакансия не принадлежит указанному пользователю.
     */
    public async deleteVacancy(userId: number, vacancyId: number) {
        const vacancy = await this.prisma.vacancy.findUnique({ where: { id: vacancyId } });
        if (!vacancy) throw new NotFoundException(MESSAGES.VACANCY_NOT_FOUND);
        if (vacancy.userId !== userId) throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
        return this.prisma.vacancy.delete({ where: { id: vacancyId } });
    }

    /**
     * Получает список вакансий, созданных указанным пользователем.
     *
     * @param userId Идентификатор пользователя.
     * @returns Массив вакансий пользователя.
     */
    public async getVacanciesByUser(userId: number) {
        return this.prisma.vacancy.findMany({ where: { userId } });
    }

    /**
     * Получает список всех вакансий.
     *
     * @returns Массив всех вакансий.
     */
    public async getAllVacancies() {
        return this.prisma.vacancy.findMany();
    }
}