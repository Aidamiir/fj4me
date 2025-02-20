import { Fragment, type ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Fragment>
            {children}
            <div className="fixed top-8 right-8">
                <ThemeToggle/>
            </div>
        </Fragment>
    );
}