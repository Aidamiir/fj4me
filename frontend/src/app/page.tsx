import { LogoutButton } from '@/app/auth/_ui';
import { ThemeToggle } from '@/components/theme';

export default function HomePage() {
    return (
        <div>
            <div>
                Home Page
            </div>
            <LogoutButton/>

            <div className="fixed top-8 right-8">
                <ThemeToggle/>
            </div>
        </div>
    );
}