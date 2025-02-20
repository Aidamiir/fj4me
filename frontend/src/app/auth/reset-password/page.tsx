import { Suspense } from 'react';
import { Box, Typography } from '@mui/material';

import ResetPasswordForm from './_ui/reset-password-form';

export default function ResetPasswordPage() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Suspense fallback={<Typography>Загрузка...</Typography>}>
                <ResetPasswordForm/>
            </Suspense>
        </Box>
    );
}