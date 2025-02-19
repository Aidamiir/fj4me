import { Box } from '@mui/material';
import { RequestResetForm } from './_ui/request-reset-form';

export default function RequesterResetPage() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <RequestResetForm/>
        </Box>
    );
}