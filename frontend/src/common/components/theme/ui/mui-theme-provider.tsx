'use client';

import { type ReactNode, useLayoutEffect, useMemo } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import { getInitialTheme } from '../model/get-initial-theme';
import { ThemeModeEnum } from '../model/theme.enums';
import { useThemeStore } from '../model/use-theme-store';
import { THEME_MANUAL_KEY, THEME_STORAGE_KEY } from '../model/theme.constants';
import { getCssVarValue } from '@/common/utils/get-css-var-value';

export const MuiThemeProvider = ({ children }: { children: ReactNode }) => {
    const { mode, setMode } = useThemeStore();

    useLayoutEffect(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === ThemeModeEnum.Light || stored === ThemeModeEnum.Dark) {
            setMode(stored as ThemeModeEnum);
        }
        else {
            const initial = getInitialTheme();
            setMode(initial);
            localStorage.setItem(THEME_STORAGE_KEY, initial);
        }
        const appliedTheme = localStorage.getItem(THEME_STORAGE_KEY) || ThemeModeEnum.Light;
        document.documentElement.classList.toggle(ThemeModeEnum.Dark, appliedTheme === ThemeModeEnum.Dark);
    }, [setMode]);

    useLayoutEffect(() => {
        const manual = localStorage.getItem(THEME_MANUAL_KEY) === 'true';
        if (manual) return;

        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = (e: MediaQueryListEvent) => {
            const systemTheme = e.matches ? ThemeModeEnum.Dark : ThemeModeEnum.Light;
            setMode(systemTheme);
            localStorage.setItem(THEME_STORAGE_KEY, systemTheme);
            document.documentElement.classList.toggle(ThemeModeEnum.Dark, systemTheme === ThemeModeEnum.Dark);
        };

        if (mql.addEventListener) {
            mql.addEventListener('change', handleSystemChange);
        }
        else {
            mql.addListener(handleSystemChange);
        }
        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener('change', handleSystemChange);
            }
            else {
                mql.removeListener(handleSystemChange);
            }
        };
    }, [setMode]);

    useLayoutEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
        document.documentElement.classList.toggle(ThemeModeEnum.Dark, mode === ThemeModeEnum.Dark);
    }, [mode]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main:
                            mode === ThemeModeEnum.Dark
                                ? getCssVarValue('--primary-main-dark', '#90caf9')
                                : getCssVarValue('--primary-main-light', '#1976d2'),
                    },
                    background: {
                        default:
                            mode === ThemeModeEnum.Dark
                                ? getCssVarValue('--background-default-dark', '#121212')
                                : getCssVarValue('--background-default-light', '#ffffff'),
                        paper:
                            mode === ThemeModeEnum.Dark
                                ? getCssVarValue('--background-paper-dark', '#1e1e1e')
                                : getCssVarValue('--background-paper-light', '#ffffff'),
                    },
                    text: {
                        primary:
                            mode === ThemeModeEnum.Dark
                                ? getCssVarValue('--text-primary-dark', '#ffffff')
                                : getCssVarValue('--text-primary-light', '#000000'),
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    );
};