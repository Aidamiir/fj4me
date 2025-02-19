export const API_MAP = {
    AUTH: {
        ROOT: '/auth',
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        CONFIRM: '/auth/confirm',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        LOGOUT_ALL: '/auth/logout-all',
        REQUEST_RESET: '/auth/request-reset',
        RESET_PASSWORD: '/auth/reset-password',
    }
} as const;