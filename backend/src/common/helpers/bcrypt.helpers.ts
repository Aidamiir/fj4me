import { randomBytes } from 'crypto';

/**
 * Шифрует переданный текст с использованием AES-256-CBC.
 * @param text Исходный текст.
 * @returns Объект с вектором инициализации (iv) и зашифрованными данными.
 */
export const encrypt = (text: string): { iv: string; encryptedData: string } => {
    const iv = randomBytes(16);
    const cipher = require('crypto').createCipheriv('aes-256-cbc', Buffer.from(process.env.REFRESH_TOKEN_ENCRYPTION_KEY || '01234567890123456789012345678901', 'utf8'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

/**
 * Вычисляет SHA-256 хэш для переданного текста.
 * @param text Исходный текст.
 * @returns Хэш в виде строки.
 */
export const computeHash = (text: string): string => {
    return require('crypto').createHash('sha256').update(text).digest('hex');
}