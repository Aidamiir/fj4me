import { type SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { Roles } from '../../_model/auth.enums';
import { AuthService } from '../../_model/auth.service';
import { MESSAGES } from '@/common/constants/messages';
import { useToastStore } from '@/common/components/toast/model/useToastStore';
import { REG_EXP } from '@/common/constants/reg-exp';

interface IRegisterFormInputs {
    email: string;
    password: string;
    confirmPassword: string;
    role: Roles;
}

export const useRegisterForm = ({ stepsLength }: { stepsLength: number }) => {
    const addToast = useToastStore((state) => state.addToast);
    const [activeStep, setActiveStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

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
            setIsFinished(true);
        },
        onError: (error: unknown) => {
            addToast({ message: String(error), severity: 'error' });
        },
    });

    const handleNext = useCallback(() => {
        setActiveStep((prevStep) => {
            if (prevStep === 0) {
                const email = getValues('email');
                if (!email) {
                    addToast({ message: MESSAGES.EMAIL_REQUIRED, severity: 'error' });
                    return prevStep;
                }
                if (!REG_EXP.EMAIL.test(email)) {
                    addToast({ message: MESSAGES.EMAIL_INVALID, severity: 'error' });
                    return prevStep;
                }
            } else if (prevStep === 1) {
                const password = getValues('password');
                const confirmPassword = getValues('confirmPassword');
                if (!password || password.length < 6) {
                    addToast({
                        message: `${MESSAGES.PASSWORD_REQUIRED} и ${MESSAGES.PASSWORD_MIN_LENGTH}`,
                        severity: 'error',
                    });
                    return prevStep;
                }
                if (password !== confirmPassword) {
                    addToast({ message: MESSAGES.PASSWORDS_MISMATCH, severity: 'error' });
                    return prevStep;
                }
            }

            if (prevStep !== stepsLength - 1) {
                return prevStep + 1;
            }

            return prevStep;
        });
    }, [getValues, addToast, stepsLength]);

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const onSubmit: SubmitHandler<IRegisterFormInputs> = (data) => {
        if (activeStep !== stepsLength - 1) {
            return;
        }
        registerMutation.mutate(data);
    };

    const handleSocialRegistration = (provider: string) => {
        addToast({
            message: MESSAGES.SOCIAL_REGISTRATION_NOT_IMPLEMENTED.replace('{provider}', provider),
            severity: 'info',
        });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleNext]);

    return {
        isFinished,
        control,
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        activeStep,
        handleBack,
        handleNext,
        registerIsPending: registerMutation.isPending,
        handleSocialRegistration,
    };
};