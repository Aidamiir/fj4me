export const MESSAGES = {
    LOGIN_SUCCESS: 'Вы успешно вошли в систему!',
    REGISTER_SUCCESS: 'Вы успешно зарегистрировались, но необходимо подтвердить почту',
    EMAIL_REQUIRED: "Email обязателен",
    PASSWORD_REQUIRED: "Пароль обязателен",
    PASSWORD_MIN_LENGTH: "Минимум 6 символов",
    CONFIRM_PASSWORD_REQUIRED: "Подтверждение пароля обязательно",
    PASSWORDS_MISMATCH: "Пароли не совпадают",
    ROLE_REQUIRED: "Выберите роль",
    SOCIAL_REGISTRATION_NOT_IMPLEMENTED: "Регистрация через {provider} пока не реализована",

} as const;