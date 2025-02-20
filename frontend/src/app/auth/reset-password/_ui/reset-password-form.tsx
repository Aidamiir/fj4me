'use client';

import Link from 'next/link';
import { Container, Box, TextField, Typography, Paper, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useResetPasswordForm } from '../_model/use-reset-password-form';
import { MESSAGES } from '@/common/constants/messages';
import { CLIENT_MAP } from '@/common/constants/client-map';
import { CustomLink } from '@/common/components/custom-link';

export default function ResetPasswordForm() {
    const { isFinished, handleSubmit, register, errors, resetPasswordIsPending } = useResetPasswordForm();

    return !isFinished ? (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
                <Typography component="h1" variant="h5">
                    Сброс пароля
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Пароль"
                        type="password"
                        autoComplete="new-password"
                        {...register('password', {
                            required: MESSAGES.PASSWORD_REQUIRED,
                            minLength: { value: 6, message: MESSAGES.PASSWORD_MIN_LENGTH },
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Подтверждение пароля"
                        type="password"
                        autoComplete="new-password"
                        {...register('confirmPassword', { required: MESSAGES.CONFIRM_PASSWORD_REQUIRED })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        loading={resetPasswordIsPending}
                        disabled={resetPasswordIsPending}
                    >
                        Отправить
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CustomLink href={CLIENT_MAP.AUTH.LOGIN} variant="body2">
                            Вернуться к входу
                        </CustomLink>
                    </Box>
                </Box>
            </Box>
        </Container>
    ) : (
        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', maxWidth: 440 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green', mb: 2 }}/>
            <Typography variant="h5" gutterBottom>
                Пароль успешно сброшен!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Теперь вы можете вернуться к входу и войти в учетную запись
            </Typography>
            <Button variant="contained" color="primary" component={Link} href={CLIENT_MAP.AUTH.LOGIN}>
                Перейти к входу
            </Button>
        </Paper>
    );
}