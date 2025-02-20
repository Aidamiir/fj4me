import { ConflictException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

import { type EnvConfig } from '../../common/interfaces/env-config';
import { MESSAGES } from '../../common/constants/messages';

@Injectable()
export class MailerService {
    private transporter;

    constructor(private readonly configService: ConfigService<EnvConfig>) {
        const host = this.configService.get<string>('SMTP_HOST');
        const port = this.configService.get<number>('SMTP_PORT');
        const user = this.configService.get<string>('SMTP_USER');
        const pass = this.configService.get<string>('SMTP_PASS');

        this.transporter = nodemailer.createTransport({
            host,
            port,
            debug: true,
            secure: true,
            auth: {
                user,
                pass,
            },
            connectionTimeout: 30000,
        });
    }

    /**
     * Приватный метод для отправки письма с общим обработчиком ошибок
     * */
    private async sendMail(mailOptions: nodemailer.SendMailOptions): Promise<void> {
        try {
            const res = await this.transporter.sendMail(mailOptions);
        } catch {
            throw new ConflictException(MESSAGES.EMAIL_SEND_FAILED);
        }
    }

    /**
     * Отправляет письмо для подтверждения регистрации пользователя.
     */
    public async sendConfirmationEmail(email: string, confirmationLink: string) {
        const mailOptions = {
            from: this.configService.get<string>('SMTP_FROM'),
            to: email,
            subject: 'Подтверждение регистрации',
            text: `Пожалуйста, подтвердите вашу регистрацию, перейдя по ссылке: ${confirmationLink}`,
            html: `<p>Пожалуйста, подтвердите вашу регистрацию, перейдя по ссылке:</p>
             <a href="${confirmationLink}">${confirmationLink}</a>`,
        };

        await this.sendMail(mailOptions);
    }

    /**
     * Отправляет письмо для сброса пароля.
     */
    public async sendPasswordResetEmail(email: string, resetLink: string) {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"No Reply" <no-reply@example.com>',
            to: email,
            subject: 'Сброс пароля',
            text: `Для сброса пароля перейдите по ссылке: ${resetLink}`,
            html: `<p>Для сброса пароля перейдите по ссылке:</p>
             <a href="${resetLink}">${resetLink}</a>`,
        };

        await this.sendMail(mailOptions);
    }

    /**
     * Отправляет письмо с кодом для входа.
     * В случае успеха метод не возвращает никаких success-сообщений,
     * все уведомления об успешном выполнении обрабатываются на фронте.
     */
    public async sendLoginCode(email: string, code: string) {
        const subject = 'Ваш код для входа';
        const text = `Ваш код для входа: ${code}. Код действителен в течение 5 минут.`;
        const mailOptions = {
            from: this.configService.get<string>('SMTP_FROM'),
            to: email,
            subject,
            text,
            html: `<p>${text}</p>`,
        };

        await this.sendMail(mailOptions);
    }
}