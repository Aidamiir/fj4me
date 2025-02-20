'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import { TanStackQueryProvider } from './tan-stack-query.provider';
import { ToastContainer } from '@/common/components/toast/ui/toast-container';

const MuiThemeProvider = dynamic(
    () => import('@/common/components/theme/ui/mui-theme-provider').then(module => module.MuiThemeProvider),
    { ssr: false }
);

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <MuiThemeProvider>
            <TanStackQueryProvider>
                {children}
            </TanStackQueryProvider>
            <ToastContainer/>
        </MuiThemeProvider>
    );
};
