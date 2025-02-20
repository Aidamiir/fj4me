export const MESSAGES = {
    LOGIN_SUCCESS: 'Вы успешно вошли в систему!',
    REGISTER_SUCCESS: 'Вы успешно зарегистрировались, но необходимо подтвердить почту',
    REQUEST_RESET_SUCCESS: 'Письмо с инструкциями по сбросу пароля отправлено вам на почту',
    RESET_PASSWORD_SUCCESS: 'Пароль успешно сброшен!',
    RESET_PASSWORD_LINK_INVALID: 'Ссылка на сброс пароля испорчена, вернитесь к восстановлению пароля и получите новую ссылку',
    CODE_SENT: 'Код отправлен на вашу почту',

    EMAIL_REQUIRED: 'Email обязателен',
    EMAIL_INVALID: 'Неверный формат email',
    PASSWORD_REQUIRED: 'Пароль обязателен',
    PASSWORD_MIN_LENGTH: 'Минимум 6 символов',
    CONFIRM_PASSWORD_REQUIRED: 'Подтверждение пароля обязательно',
    PASSWORDS_MISMATCH: 'Пароли не совпадают',
    ROLE_REQUIRED: 'Выберите роль',
    SOCIAL_REGISTRATION_NOT_IMPLEMENTED: 'Регистрация через {provider} пока не реализована',
} as const;