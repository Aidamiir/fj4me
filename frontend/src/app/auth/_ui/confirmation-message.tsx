'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Paper, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import RegisterForm from './register-form';
import { CLIENT_MAP } from '@/common/constants/client-map';

export const ConfirmationMessage = () => {
    const searchParams = useSearchParams();
    const isConfirmed = searchParams.get('confirmed');

    console.log(isConfirmed);

    return isConfirmed ? (
        <Paper elevation={6} sx={{ p: 4, textAlign: 'center', maxWidth: 440 }}>
            {isConfirmed === 'true' ? (
                <Fragment>
                    <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green', mb: 2 }}/>
                    <Typography variant="h5" gutterBottom>
                        Почта успешно подтверждена!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Теперь вы можете войти в свою учётную запись.
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} href={CLIENT_MAP.AUTH.LOGIN}>
                        Перейти к входу
                    </Button>
                </Fragment>
            ) : (
                <Fragment>
                    <Typography variant="h5" gutterBottom>
                        Произошла ошибка при подтверждении почты
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Возможно ссылка истекла, вернитесь к входу и получите новое письмо подтвеждения
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} href={CLIENT_MAP.AUTH.LOGIN}>
                        Перейти к входу
                    </Button>
                </Fragment>
            )}
        </Paper>
    ) : <RegisterForm/>;
}