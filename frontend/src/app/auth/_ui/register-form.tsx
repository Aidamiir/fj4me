'use client';

import { Fragment } from 'react';
import { Controller } from 'react-hook-form';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    IconButton,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';

import { useRegisterForm } from '../_model/use-register-form';
import { Roles } from '../_model/auth.enums';
import { MESSAGES } from '@/common/constants/messages';
import { ROUTER_MAP } from '@/common/constants/router-map';
import { CustomLink } from '@/common/components/custom-link';
import { CustomStepper } from '@/common/components/custom-stepper/ui/custom-stepper';
import { type StepDefinition } from '@/common/components/custom-stepper/model/custom-stepper.interfaces';

const steps: StepDefinition[] = [
    { label: 'Введите email', Icon: MailOutlineIcon },
    { label: 'Придумайте пароль', Icon: LockOutlinedIcon },
    { label: 'Выберите роль', Icon: PersonOutlineIcon },
];

export default function RegisterForm() {
    const {
        control,
        register,
        handleSubmit,
        errors,
        activeStep,
        handleBack,
        handleNext,
        registerMutation,
        handleSocialRegistration
    } = useRegisterForm();

    return (
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
                            {...register('email', { required: MESSAGES.EMAIL_REQUIRED })}
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
                        </Fragment>
                    )}
                    {activeStep === 2 && (
                        <FormControl fullWidth margin="normal" error={!!errors.role}>
                            <InputLabel id="role-label">Роль</InputLabel>
                            <Controller
                                name="role"
                                control={control}
                                rules={{ required: MESSAGES.ROLE_REQUIRED }}
                                render={({ field }) => (
                                    <Select {...field} labelId="role-label" label="Роль">
                                        <MenuItem value={Roles.STUDENT}>Студент</MenuItem>
                                        <MenuItem value={Roles.EMPLOYER}>Работодатель</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
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
                                disabled={registerMutation.isPending}
                                sx={{ ml: activeStep > 0 ? 2 : 0 }}
                            >
                                {registerMutation.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
                            </Button>
                        )}
                    </Box>
                    <Divider sx={{ mt: 3, mb: 2 }}>или</Divider>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <IconButton onClick={() => handleSocialRegistration('google')}>
                            <GoogleIcon/>
                        </IconButton>
                        <IconButton onClick={() => handleSocialRegistration('facebook')}>
                            <FacebookIcon/>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CustomLink href={ROUTER_MAP.AUTH.LOGIN} variant="body2">
                            Уже зарегистрированы? Войти
                        </CustomLink>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}