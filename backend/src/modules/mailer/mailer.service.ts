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
            connectionTimeout: 20000,
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
        try {
            const mailOptions = {
                from: this.configService.get<string>('SMTP_FROM'),
                to: email,
                subject: 'Подтверждение регистрации',
                text: `Пожалуйста, подтвердите вашу регистрацию, перейдя по ссылке: ${confirmationLink}`,
                html: `<p>Пожалуйста, подтвердите вашу регистрацию, перейдя по ссылке:</p>
             <a href="${confirmationLink}">${confirmationLink}</a>`,
            };

            const res = await this.transporter.sendMail(mailOptions);
            console.log(res);
        }
        catch (err) {
            console.log(err);
            throw new ConflictException(MESSAGES.EMAIL_SEND_FAILED);
        }
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