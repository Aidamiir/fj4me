import { type SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Roles } from './auth.enums';
import { AuthService } from './auth.service';
import { MESSAGES } from '@/common/constants/messages';
import { ROUTER_MAP } from '@/common/constants/router-map';
import { useToastStore } from '@/common/components/toast/model/useToastStore';

interface IRegisterFormInputs {
    email: string;
    password: string;
    confirmPassword: string;
    role: Roles;
}

export const useRegisterForm = () => {
    const router = useRouter();
    const addToast = useToastStore((state) => state.addToast);
    const [activeStep, setActiveStep] = useState(0);

    const {
        control,
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<IRegisterFormInputs>({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            role: Roles.STUDENT,
        },
        mode: 'onChange',
    });

    const registerMutation = useMutation({
        mutationFn: (data: IRegisterFormInputs) => {
            const { email, password, role } = data;
            return AuthService.register({ email, password, role });
        },
        onSuccess: () => {
            addToast({ message: MESSAGES.REGISTER_SUCCESS, severity: 'success' });
            router.replace(ROUTER_MAP.ROOT);
        },
        onError: (error: unknown) => {
            const errorMsg = error instanceof Error ? error.message : String(error);
            addToast({ message: errorMsg, severity: 'error' });
        },
    });

    const handleNext = () => {
        if (activeStep === 0) {
            const email = getValues('email');
            if (!email) {
                addToast({ message: MESSAGES.EMAIL_REQUIRED, severity: 'error' });
                return;
            }
        }
        else if (activeStep === 1) {
            const password = getValues('password');
            const confirmPassword = getValues('confirmPassword');
            if (!password || password.length < 6) {
                addToast({
                    message: `${MESSAGES.PASSWORD_REQUIRED} и ${MESSAGES.PASSWORD_MIN_LENGTH}`,
                    severity: 'error',
                });
                return;
            }
            if (password !== confirmPassword) {
                addToast({ message: MESSAGES.PASSWORDS_MISMATCH, severity: 'error' });
                return;
            }
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const onSubmit: SubmitHandler<IRegisterFormInputs> = (data) => {
        registerMutation.mutate(data);
    };

    const handleSocialRegistration = (provider: string) => {
        addToast({
            message: MESSAGES.SOCIAL_REGISTRATION_NOT_IMPLEMENTED.replace('{provider}', provider),
            severity: 'info',
        });
    };

    return {
        control,
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        activeStep,
        handleBack,
        handleNext,
        registerMutation,
        handleSocialRegistration,
    };
};