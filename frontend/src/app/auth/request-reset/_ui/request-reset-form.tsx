'use client';

import MuiLink from '@mui/material/Link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';

import { useRequestResetForm } from '@/app/auth/request-reset/_model';

export const RequestResetForm = () => {
    const { router, register, handleSubmit, errors, requestResetIsPending, isFinished } = useRequestResetForm();

    return !isFinished ? (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                }}
            >
                <Typography component="h1" variant="h5">
                    Восстановление пароля
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        autoComplete="email"
                        autoFocus
                        disabled={requestResetIsPending}
                        {...register('email', { required: 'Email обязателен' })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        loading={requestResetIsPending}
                    >
                        Отправить
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <MuiLink component="button" variant="body2" onClick={router.back}>
                            Вернуться назад
                        </MuiLink>
                    </Box>
                </Box>
            </Box>
        </Container>
    ) : (
        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', maxWidth: 440 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green', mb: 2 }}/>
            <Typography variant="h5" gutterBottom>
                Отлично, запрос отправлен!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                На вашу почту выслано письмо с инструкциями по восстановлению пароля
            </Typography>
        </Paper>
    );
};