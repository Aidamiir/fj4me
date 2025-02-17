import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    /**
     * Получает профиль пользователя по его идентификатору.
     *
     * @param userId - Идентификатор пользователя.
     * @returns Объект пользователя с включенным профилем, если он существует.
     */
    public async getProfile(userId: number) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
    }

    /**
     * Обновляет профиль пользователя или создает его, если профиль не существует.
     *
     * @param userId - Идентификатор пользователя, чей профиль обновляется или создается.
     * @param firstName
     * @param lastName
     * @param phone
     * @returns Обновленный или созданный объект профиля.
     */
    public async updateProfile(userId: number, firstName: string, lastName: string, phone: string) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (profile) {
            return this.prisma.profile.update({
                where: { userId },
                data: {
                    firstName,
                    lastName,
                    phone,
                },
            });
        }
        else {
            return this.prisma.profile.create({
                data: { firstName, lastName, phone, userId },
            });
        }
    }
}