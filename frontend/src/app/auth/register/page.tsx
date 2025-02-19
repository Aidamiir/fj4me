import { Suspense } from 'react';
import { Box, Typography } from '@mui/material';
import { ConfirmationMessage } from './_ui/confirmation-message';

export default function RegisterPage() {
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
                <ConfirmationMessage/>
            </Suspense>
        </Box>
    );
}