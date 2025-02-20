'use client';

import { Fragment } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import { Container, Box, TextField, Button, Typography, Divider, IconButton } from '@mui/material';

import { useLoginForm } from '../_model/use-login-form';
import { CLIENT_MAP } from '@/common/constants/client-map';
import { CustomLink } from '@/common/components/custom-link';
import { CustomStepper } from '@/common/components/custom-stepper/ui/custom-stepper';
import { type StepDefinition } from '@/common/components/custom-stepper/model/custom-stepper.interfaces';

const steps: StepDefinition[] = [
    { label: 'Введите email и пароль', Icon: MailOutlineIcon },
    { label: 'Введите код из письма', Icon: LockOutlinedIcon },
];

export const LoginForm = () => {
    const {
        register,
        handleSubmit,
        errors,
        activeStep,
        handleBack,
        handleNext,
        requestCodePending,
        verifyCodePending,
    } = useLoginForm({ stepsLength: steps.length });

    return (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
                <Typography component="h1" variant="h5">
                    Вход в систему
                </Typography>
                <CustomStepper activeStep={activeStep} steps={steps} />
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    {activeStep === 0 && (
                        <Fragment>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
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
                                label="Пароль"
                                type="password"
                                autoComplete="current-password"
                                {...register('password', { required: 'Пароль обязателен' })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Fragment>
                    )}
                    {activeStep === 1 && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Код"
                            autoFocus
                            {...register('code', { required: 'Код обязателен' })}
                            error={!!errors.code}
                            helperText={errors.code?.message}
                        />
                    )}
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: activeStep > 0 ? 'space-between' : 'center',
                            mt: 3,
                        }}
                    >
                        {activeStep > 0 && (
                            <Button variant="outlined" onClick={handleBack}>
                                Назад
                            </Button>
                        )}
                        {activeStep < steps.length - 1 && (
                            <Button variant="contained" onClick={handleNext} disabled={requestCodePending}>
                                Далее
                            </Button>
                        )}
                        {activeStep === steps.length - 1 && (
                            <Button type="submit" variant="contained" disabled={verifyCodePending}>
                                Войти
                            </Button>
                        )}
                    </Box>
                    {activeStep === 0 && (
                        <Fragment>
                            <Divider sx={{ mt: 3, mb: 2 }}>или</Divider>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <IconButton onClick={() => alert('google')}>
                                    <GoogleIcon />
                                </IconButton>
                                <IconButton onClick={() => alert('facebook')}>
                                    <FacebookIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <CustomLink href={CLIENT_MAP.AUTH.REQUEST_RESET} variant="body2">
                                    Забыли пароль?
                                </CustomLink>
                                <CustomLink href={CLIENT_MAP.AUTH.REGISTER.ROOT} variant="body2">
                                    Регистрация
                                </CustomLink>
                            </Box>
                        </Fragment>
                    )}
                </Box>
            </Box>
        </Container>
    );
}