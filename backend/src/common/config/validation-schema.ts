import * as Joi from 'joi';
import { type EnvConfig } from '../interfaces/env-config';

export const validationSchema = Joi.object<EnvConfig>({
    DATABASE_URL: Joi.string().uri().required(),

    BASE_URL: Joi.string().uri().required(),
    FRONTEND_URL: Joi.string().uri().required(),

    DOMAIN: Joi.string().required(),
    PORT: Joi.number().required(),
    HOST: Joi.string().hostname().required(),
    CORS_ORIGIN: Joi.string().required(),

    JWT_SECRET: Joi.string().required(),

    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().required(),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
    SMTP_FROM: Joi.string().required(),

    THROTTLER_LIMIT_SECONDS: Joi.number().required(),
    THROTTLER_LIMIT_QUERIES: Joi.number().required(),
});