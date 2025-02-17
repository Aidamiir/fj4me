import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

import { type EnvConfig } from '../../common/interfaces/env-config';

@Injectable()
export class MailerService {
    private transporter;

    constructor(private readonly configService: ConfigService<EnvConfig>) {
        const host = this.configService.get<string>('SMTP_HOST');
        const port = this.configService.get('SMTP_PORT');
        const user = this.configService.get<string>('SMTP_USER');
        const pass = this.configService.get<string>('SMTP_PASS');

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: false,
            auth: {
                user,
                pass,
            },
        });
    }

    /**
     * Отправляет письмо для подтверждения регистрации пользователя.
     *
     * @param email - Электронная почта получателя.
     * @param confirmationLink - Ссылка для подтверждения регистрации.
     * @returns Promise, который выполняется при успешной отправке письма.
     */
    public async sendConfirmationEmail(email: string, confirmationLink: string) {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"No Reply" <no-reply@example.com>',
            to: email,
            subject: 'Подтверждение регистрации',
            text: `Пожалуйста, подтвердите вашу регистрацию, перейдя по ссылке: ${confirmationLink}`,
            html: `<p>Пожалуйста, подтвердите вашу регистрацию, перейдя по ссылке:</p>
             <a href="${confirmationLink}">${confirmationLink}</a>`,
        };

        await this.transporter.sendMail(mailOptions);
    }

    /**
     * Отправляет письмо для сброса пароля.
     * @param email Электронная почта получателя.
     * @param resetLink Ссылка для сброса пароля.
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

        await this.transporter.sendMail(mailOptions);
    }
}