import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { AuthService } from '@/app/auth/_model';
import { useToastStore } from '@/components/toast';
import { MESSAGES } from '@/common/constants';

type IRequestResetFormInputs = {
    email: string;
};

export const useRequestResetForm = () => {
    const addToast = useToastStore((state) => state.addToast);
    const [isFinished, setIsFinished] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<IRequestResetFormInputs>({
        defaultValues: { email: '' },
        mode: 'onChange'
    });

    const requestResetMutation = useMutation({
        mutationFn: (data: IRequestResetFormInputs) => AuthService.requestReset(data),
        onSuccess: () => {
            addToast({ message: MESSAGES.REQUEST_RESET_SUCCESS, severity: 'success' });
            setIsFinished(true);
        },
        onError: (error: unknown) => {
            addToast({ message: String(error), severity: 'error' });
        },
    });

    const onSubmit: SubmitHandler<IRequestResetFormInputs> = (data) => {
        requestResetMutation.mutate(data);
    };

    return {
        router,
        isFinished,
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        requestResetIsPending: requestResetMutation.isPending,
    }
}
