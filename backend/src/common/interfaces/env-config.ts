export interface EnvConfig {
    DATABASE_URL: string;

    BASE_URL: string;
    FRONTEND_URL: string;

    DOMAIN: string;
    PORT: number;
    HOST: string;
    CORS_ORIGIN: string;

    THROTTLER_LIMIT_SECONDS: number;
    THROTTLER_LIMIT_QUERIES: number;

    JWT_SECRET: string;

    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM: string;

    GOSUSLUGI_CLIENT_ID: string;
    GOSUSLUGI_CLIENT_SECRET: string;
    GOSUSLUGI_REDIRECT_URI: string;
}