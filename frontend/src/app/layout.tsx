import 'swiper/css';
import './globals.css';

import { type ReactNode } from 'react';
import { Providers } from '@/app/_providers';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru">
        <body>
            <Providers>
                {children}
            </Providers>
        </body>
        </html>
    );
}