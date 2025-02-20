import { useState, useCallback, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { AuthService } from '@/app/auth/_model';
import { ACCESS_TOKEN_KEY } from '@/app/auth/_model';
import { useToastStore } from '@/components/toast';
import { CLIENT_MAP, MESSAGES } from '@/common/constants';

interface ILoginFormInputs {
    email: string;
    password: string;
    code: string;
}

interface UseLoginFormProps {
    stepsLength: number;
}

export const useLoginForm = ({ stepsLength }: UseLoginFormProps) => {
    const addToast = useToastStore((state) => state.addToast);
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<ILoginFormInputs>({
        defaultValues: { email: '', password: '', code: '' },
        mode: 'onChange',
    });

    const requestCodeMutation = useMutation({
        mutationFn: (data: { email: string; password: string }) => AuthService.requestLoginCode(data),
        onSuccess: () => {
            addToast({ message: MESSAGES.CODE_SENT, severity: 'success' });
            setActiveStep((prev) => prev + 1);
        },
        onError: (error: unknown) => {
            addToast({ message: String(error), severity: 'error' });
        },
    });

    const verifyCodeMutation = useMutation({
        mutationFn: (data: { email: string; code: string }) => AuthService.verifyLoginCode(data),
        onSuccess: (res) => {
            addToast({ message: MESSAGES.LOGIN_SUCCESS, severity: 'success' });
            localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
            router.replace(CLIENT_MAP.ROOT);
        },
        onError: (error: unknown) => {
            addToast({ message: String(error), severity: 'error' });
        },
    });

    const handleNext = useCallback(() => {
        if (activeStep === 0) {
            const email = getValues('email');
            const password = getValues('password');
            if (!email) {
                addToast({ message: MESSAGES.EMAIL_REQUIRED, severity: 'error' });
                return;
            }
            if (!password) {
                addToast({ message: MESSAGES.PASSWORD_REQUIRED, severity: 'error' });
                return;
            }
            requestCodeMutation.mutate({ email, password });
        }
    }, [activeStep, getValues, addToast, requestCodeMutation]);

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const onSubmit: SubmitHandler<ILoginFormInputs> = (data) => {
        if (activeStep !== stepsLength - 1) return;
        verifyCodeMutation.mutate({ email: data.email, code: data.code });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && activeStep === 0) {
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, activeStep]);

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        activeStep,
        handleBack,
        handleNext,
        requestCodePending: requestCodeMutation.isPending,
        verifyCodePending: verifyCodeMutation.isPending,
    };
};