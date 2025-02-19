export const CLIENT_MAP = {
    ROOT: '/',
    AUTH: {
        ROOT: '/auth',
        LOGIN: '/auth/login',
        REGISTER: {
            ROOT: '/auth/register',
            CONFIRM_QUERY: 'confirmed',
        },
    }
} as const;