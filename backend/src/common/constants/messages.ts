export const MESSAGES = {
    REGISTER_SUCCESS: 'Пользователь успешно зарегистрирован. Проверьте почту для подтверждения регистрации.',

    CODE_INVALID: 'Неверный код',
    CODE_EXPIRED: 'Срок действия кода истёк',
    CODE_ALREADY_SEND: 'Код уже был отправлен на вашу почту',

    LOGOUT_SUCCESS: 'Выход выполнен успешно',
    LOGIN_FAILURE: 'Неверные данные или email не подтвержден',
    LOGOUT_ALL_SUCCESS: 'Все сессии завершены успешно',

    EMAIL_CONFIRMATION_SUCCESS: 'Email подтвержден успешно',
    EMAIL_NOT_CONFIRMED: 'Email не подтверждён',
    EMAIL_SEND_FAILED: 'Произошла ошибка при отправке письма на почту',
    EMAIL_CONFIRMATION_RESENT: 'Ваш аккаунт не подтвержден и письмо подтверждения истекло. Новое письмо отправлено на почту',

    CONFIRMATION_INVALID: 'Неверный токен подтверждения',
    CONFIRMATION_EXPIRED: 'Токен подтверждения истёк',

    REFRESH_TOKEN_MISSING: 'Refresh token не предоставлен',
    REFRESH_TOKEN_INVALID: 'Неверный токен обновления',
    REFRESH_TOKEN_EXPIRED: 'Токен обновления истёк',

    PASSWORD_RESET_EMAIL_ALREADY_SEND: 'Письмо с инструкциями для восстановления уже было отправлено на почту',
    PASSWORD_RESET_INSTRUCTIONS_SENT: 'Инструкции по сбросу пароля отправлены на вашу почту.',
    PASSWORD_RESET_INVALID_TOKEN: 'Неверный токен сброса пароля',
    PASSWORD_RESET_EXPIRED: 'Токен сброса пароля истёк',
    PASSWORD_CHANGED_SUCCESS: 'Пароль успешно изменён',

    RESUME_NOT_FOUND: 'Резюме не найдено',
    SESSION_NOT_FOUND: 'Сессия не найдена',
    VACANCY_NOT_FOUND: 'Вакансия не найдена',
    APPLICATION_NOT_FOUND: 'Отклик не найден',

    USER_GET_INFO_FAILED: 'Не удалось получить информацию о пользователе',
    USER_NOT_FOUND: 'Пользователь с таким email не найден',
    USER_ALREADY_EXIST: 'Пользователь с такими данными уже существует',

    ACCESS_DENIED: 'Доступ запрещен',
    INTERNAL_SERVER_ERROR: 'Ошибка на стороне сервера'
} as const;