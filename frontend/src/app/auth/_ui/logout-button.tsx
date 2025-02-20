'use client';

import { Button } from '@mui/material';
import { useLogout } from '@/app/auth/_model';

export const LogoutButton = () => {
    const { handleLogout, logoutIsPending } = useLogout();

    return (
        <Button
            variant="contained"
            onClick={handleLogout}
            disabled={logoutIsPending}
        >
            Выйти
        </Button>
    );
};