export const MESSAGES = {
    REGISTER_SUCCESS: 'Пользователь успешно зарегистрирован. Проверьте почту для подтверждения регистрации.',

    LOGOUT_SUCCESS: 'Выход выполнен успешно',
    LOGIN_FAILURE: 'Неверные данные или email не подтвержден',
    LOGOUT_ALL_SUCCESS: 'Все сессии завершены успешно',

    EMAIL_CONFIRMATION_SUCCESS: 'Email подтвержден успешно',
    EMAIL_NOT_CONFIRMED: 'Email не подтверждён',

    CONFIRMATION_INVALID: 'Неверный токен подтверждения',
    CONFIRMATION_EXPIRED: 'Токен подтверждения истёк',

    REFRESH_TOKEN_MISSING: 'Refresh token не предоставлен',
    REFRESH_TOKEN_INVALID: 'Неверный токен обновления',
    REFRESH_TOKEN_EXPIRED: 'Токен обновления истёк',

    PASSWORD_RESET_INSTRUCTIONS_SENT: 'Инструкции по сбросу пароля отправлены на вашу почту.',
    PASSWORD_RESET_INVALID_TOKEN: 'Неверный токен сброса пароля',
    PASSWORD_RESET_EXPIRED: 'Токен сброса пароля истёк',
    PASSWORD_CHANGED_SUCCESS: 'Пароль успешно изменён',

    RESUME_NOT_FOUND: 'Резюме не найдено',
    SESSION_NOT_FOUND: 'Сессия не найдена',
    VACANCY_NOT_FOUND: 'Вакансия не найдена',
    APPLICATION_NOT_FOUND: 'Отклик не найден',
    USER_NOT_FOUND: 'Пользователь с таким email не найден',

    ACCESS_DENIED: 'Доступ запрещен',
    INTERNAL_SERVER_ERROR: 'Ошибка на стороне сервера'
} as const;