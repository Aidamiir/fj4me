import { Box } from '@mui/material';
import { LoginForm } from './_ui/login-form';

export default function LoginPage() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <LoginForm/>
        </Box>
    )
}