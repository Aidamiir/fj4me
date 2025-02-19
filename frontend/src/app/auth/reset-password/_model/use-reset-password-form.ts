import { type SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { AuthService } from '../../_model/auth.service';
import { MESSAGES } from '@/common/constants/messages';
import { useToastStore } from '@/common/components/toast/model/useToastStore';
import { CLIENT_MAP } from '@/common/constants/client-map';

interface IResetPasswordFormInputs {
    password: string;
    confirmPassword: string;
}

export const useResetPasswordForm = () => {
    const addToast = useToastStore((state) => state.addToast);
    const [isFinished, setIsFinished] = useState(false);

    const searchParams = useSearchParams();
    const tokenFromUrl = searchParams.get(CLIENT_MAP.AUTH.RESET_PASSWORD.TOKEN_QUERY)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IResetPasswordFormInputs>({
        defaultValues: { password: '', confirmPassword: '' },
        mode: 'onChange',
    });

    const resetPasswordMutation = useMutation({
        mutationFn: (data: IResetPasswordFormInputs & { token: string }) => {
            return AuthService.resetPassword({ token: data.token, newPassword: data.password });
        },
        onSuccess: () => {
            addToast({ message: MESSAGES.RESET_PASSWORD_SUCCESS, severity: 'success' });
            setIsFinished(true);
        },
        onError: (error: unknown) => {
            addToast({ message: String(error), severity: 'error' });
        },
    });

    const onSubmit: SubmitHandler<IResetPasswordFormInputs> = (data) => {
        console.log(tokenFromUrl);
        if (!tokenFromUrl) {
            addToast({
                message: MESSAGES.RESET_PASSWORD_LINK_INVALID,
                severity: 'error',
            });
            return;
        }
        if (!data.password || data.password.length < 6) {
            addToast({
                message: `${MESSAGES.PASSWORD_REQUIRED} и ${MESSAGES.PASSWORD_MIN_LENGTH}`,
                severity: 'error',
            });
            return;
        }
        if (data.password !== data.confirmPassword) {
            addToast({ message: MESSAGES.PASSWORDS_MISMATCH, severity: 'error' });
            return;
        }
        resetPasswordMutation.mutate({ token: tokenFromUrl, ...data });
    };

    return {
        isFinished,
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        resetPasswordMutation,
    };
};