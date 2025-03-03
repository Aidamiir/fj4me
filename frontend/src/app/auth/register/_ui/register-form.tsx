'use client';

import { Fragment } from 'react';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    IconButton,
    Paper,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useRegisterForm } from '@/app/auth/register/_model';
import { CustomLink } from '@/components/custom-link';
import { CustomStepper } from '@/components/custom-stepper';
import { GosuslugiIcon } from '@/components/gosuslugi-icon';
import { type StepDefinition } from '@/components/custom-stepper';
import { CLIENT_MAP, MESSAGES, REG_EXP } from '@/common/constants';

const steps: StepDefinition[] = [
    { label: 'Введите email', Icon: MailOutlineIcon },
    { label: 'Придумайте пароль', Icon: LockOutlinedIcon },
];

export default function RegisterForm() {
    const {
        isFinished,
        register,
        handleSubmit,
        errors,
        activeStep,
        handleBack,
        handleNext,
        registerIsPending
    } = useRegisterForm({ stepsLength: steps.length });

    return !isFinished ? (
        <Container maxWidth="xs">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
                <Typography component="h1" variant="h5">
                    Регистрация
                </Typography>
                <CustomStepper activeStep={activeStep} steps={steps}/>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    {activeStep === 0 && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            autoComplete="email"
                            autoFocus
                            disabled={registerIsPending}
                            {...register('email', {
                                required: MESSAGES.EMAIL_REQUIRED, pattern: {
                                    value: REG_EXP.EMAIL,
                                    message: MESSAGES.EMAIL_INVALID,
                                }
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                    {activeStep === 1 && (
                        <Fragment>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Пароль"
                                type="password"
                                autoComplete="new-password"
                                disabled={registerIsPending}
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
                                disabled={registerIsPending}
                                {...register('confirmPassword', { required: MESSAGES.CONFIRM_PASSWORD_REQUIRED })}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                            />
                        </Fragment>
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
                            <Button variant="contained" onClick={handleNext}>
                                Далее
                            </Button>
                        )}
                        {activeStep === steps.length - 1 && (
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                loading={registerIsPending}
                                sx={{ ml: activeStep > 0 ? 2 : 0 }}
                            >
                                Зарегистрироваться
                            </Button>
                        )}
                    </Box>
                    <Divider sx={{ mt: 3, mb: 2 }}>или</Divider>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <IconButton onClick={() => alert('google')} disabled={true}>
                            <GosuslugiIcon/>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CustomLink href={CLIENT_MAP.AUTH.LOGIN} variant="body2">
                            Уже зарегистрированы? Войти
                        </CustomLink>
                    </Box>
                </Box>
            </Box>
        </Container>
    ) : (
        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', maxWidth: 440 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green', mb: 2 }}/>
            <Typography variant="h5" gutterBottom>
                Регистрация прошла успешно!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Теперь вы можете перейти на почту и подтвердить ее
            </Typography>
        </Paper>
    );
}