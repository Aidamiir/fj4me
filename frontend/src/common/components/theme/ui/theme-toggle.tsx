'use client';

import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { useThemeStore } from '../model/use-theme-store';
import { ThemeModeEnum } from '../model/theme.enums';
import { THEME_STORAGE_KEY } from '../model/theme.constants';

export function ThemeToggle() {
    const { mode, setMode } = useThemeStore();

    const handleToggle = () => {
        const newMode = mode === ThemeModeEnum.Light ? ThemeModeEnum.Dark : ThemeModeEnum.Light;
        setMode(newMode);
        localStorage.setItem(THEME_STORAGE_KEY, newMode);
        document.documentElement.classList.toggle(ThemeModeEnum.Dark, newMode === ThemeModeEnum.Dark);
    };

    return (
        <IconButton onClick={handleToggle} color="inherit">
            {mode === ThemeModeEnum.Light ? <DarkModeIcon color="primary"/> : <LightModeIcon/>}
        </IconButton>
    );
}