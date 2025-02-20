export const CLIENT_MAP = {
    ROOT: '/',
    AUTH: {
        ROOT: '/auth',
        LOGIN: '/auth/login',
        REGISTER: {
            ROOT: '/auth/register',
            CONFIRM_QUERY: 'confirmed',
        },
        REQUEST_RESET: '/auth/request-reset',
        RESET_PASSWORD: {
            ROOT: '/auth/reset-password',
            TOKEN_QUERY: 'token',
        },
    },
    SEARCH: {
        ROOT: '/search',
    },
    RESUMES: {
        ROOT: '/resumes',
        RECOMMENDED: '/resumes/recommend',
    },
    VACANCIES: {
        ROOT: '/vacancies',
        RECOMMENDED: '/vacancies/recommend',
    },
    PROFILE: {
        ROOT: '/profile',
    }
} as const;