import './globals.css';

import { type ReactNode } from 'react';

import { TanStackQueryProvider } from './_providers/tan-stack-query.provider';
import { MuiThemeProvider } from '@/common/components/theme/ui/mui-theme-provider';
import { ToastContainer } from '@/common/components/toast/ui/toast-container';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru">
        <body>
        <MuiThemeProvider>
            <TanStackQueryProvider>
                {children}
            </TanStackQueryProvider>
            <ToastContainer/>
        </MuiThemeProvider>
        </body>
        </html>
    );
}