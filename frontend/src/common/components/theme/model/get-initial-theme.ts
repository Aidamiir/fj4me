import { ThemeModeEnum } from './theme.enums';
import { THEME_STORAGE_KEY } from './theme.constants';

export const getInitialTheme = (): ThemeModeEnum => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === ThemeModeEnum.Light || stored === ThemeModeEnum.Dark) {
            return stored as ThemeModeEnum;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? ThemeModeEnum.Dark
            : ThemeModeEnum.Light;
    }
    return ThemeModeEnum.Light;
};