import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MESSAGES } from '../../common/constants/messages';

@Injectable()
export class ResumeService {
    constructor(private prisma: PrismaService) {}

    /**
     * Создает новое резюме для указанного пользователя.
     *
     * @param userId - Идентификатор пользователя, которому принадлежит резюме.
     * @param title - Заголовок резюме.
     * @param content - Содержимое резюме.
     * @returns Объект созданного резюме.
     */
    public async createResume(userId: number, title: string, content: string) {
        return this.prisma.resume.create({
            data: {
                title,
                content,
                user: { connect: { id: userId } },
            },
        });
    }

    /**
     * Обновляет резюме пользователя.
     *
     * @param userId - Идентификатор пользователя, пытающегося обновить резюме.
     * @param resumeId - Идентификатор резюме, которое необходимо обновить.
     * @param title - Новый заголовок резюме (опционально).
     * @param content - Новое содержимое резюме (опционально).
     * @returns Обновленное резюме.
     * @throws NotFoundException если резюме не найдено.
     * @throws ForbiddenException если резюме не принадлежит указанному пользователю.
     */
    public async updateResume(userId: number, resumeId: number, title?: string, content?: string) {
        const resume = await this.prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume) throw new NotFoundException(MESSAGES.RESUME_NOT_FOUND);
        if (resume.userId !== userId) throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
        return this.prisma.resume.update({
            where: { id: resumeId },
            data: { title, content },
        });
    }

    /**
     * Удаляет резюме пользователя.
     *
     * @param userId - Идентификатор пользователя, пытающегося удалить резюме.
     * @param resumeId - Идентификатор резюме, которое необходимо удалить.
     * @returns Объект удаленного резюме.
     * @throws NotFoundException если резюме не найдено.
     * @throws ForbiddenException если резюме не принадлежит указанному пользователю.
     */
    public async deleteResume(userId: number, resumeId: number) {
        const resume = await this.prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume) throw new NotFoundException(MESSAGES.RESUME_NOT_FOUND);
        if (resume.userId !== userId) throw new ForbiddenException(MESSAGES.ACCESS_DENIED);
        return this.prisma.resume.delete({ where: { id: resumeId } });
    }

    /**
     * Получает список резюме, принадлежащих указанному пользователю.
     *
     * @param userId - Идентификатор пользователя.
     * @returns Массив резюме пользователя.
     */
    public async getResumesByUser(userId: number) {
        return this.prisma.resume.findMany({ where: { userId } });
    }
}