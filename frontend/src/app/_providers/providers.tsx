'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import { TanStackQueryProvider } from './tan-stack-query.provider';
import { ToastContainer } from '@/components/toast';

const MuiThemeProvider = dynamic(
    () => import('@/components/theme').then(module => module.MuiThemeProvider),
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
