'use client';

import { Container, Box, TextField, Button, Typography, Divider, IconButton } from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';

import { useLoginForm } from '../_model/use-login-form';
import { CLIENT_MAP } from '@/common/constants/client-map';
import { CustomLink } from '@/common/components/custom-link';

export const LoginForm = () => {
    const { register, handleSubmit, errors, loginMutation, handleSocialLogin } = useLoginForm();

    return (
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
                    Вход в систему
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
                        {...register('email', { required: 'Email обязателен' })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="Пароль"
                        type="password"
                        autoComplete="current-password"
                        {...register('password', { required: 'Пароль обязателен' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        loading={loginMutation.isPending}
                        disabled={loginMutation.isPending}
                    >
                        Войти
                    </Button>
                    <Divider>или</Divider>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <IconButton onClick={() => handleSocialLogin('google')}>
                            <GoogleIcon/>
                        </IconButton>
                        <IconButton onClick={() => handleSocialLogin('facebook')}>
                            <FacebookIcon/>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <CustomLink href="#" variant="body2">
                            Забыли пароль?
                        </CustomLink>
                        <CustomLink href={CLIENT_MAP.AUTH.REGISTER.ROOT} variant="body2">
                            Регистрация
                        </CustomLink>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};