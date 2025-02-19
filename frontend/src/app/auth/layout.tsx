import { Fragment, type ReactNode } from 'react';
import { ThemeToggle } from '@/common/components/theme/ui/theme-toggle';

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