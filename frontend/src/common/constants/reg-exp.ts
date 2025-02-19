export const REG_EXP = {
    EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    RU_PHONE: /^\+7 \((9\d{2})\) \d{3}-\d{2}-\d{2}$/,
    NOT_SEPARATE: /^\+[0-9-]+$/,
    NOT_SPACES: /^\S+$/i,
    NUMBERS: /^\d+$/,
    LATIN_AND_CYRILLIC_WITH_SPACES: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
    HEX_CODE: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    URL: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
    HAS_UPPERCASE: /[A-Z]/,
    HAS_LOWERCASE: /[a-z]/,
    HAS_SPECIAL_CHAR: /[!@#$%^&*()\-_=+~[\]{}|;:',.<>?/`]/,
    ONLY_ENGLISH: /^[A-Za-z\d!@#$%^&*()\-_=+~[\]{}|;:',.<>?/`]+$/,
};
