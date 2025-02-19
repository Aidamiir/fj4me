import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { ACCESS_TOKEN_KEY } from './auth.constants';
import { AuthService } from './auth.service';
import { MESSAGES } from '@/common/constants/messages';
import { CLIENT_MAP } from '@/common/constants/client-map';
import { useToastStore } from '@/common/components/toast/model/useToastStore';

type LoginFormInputs = {
    email: string;
    password: string;
};

export const useLoginForm = () => {
    const router = useRouter();
    const addToast = useToastStore((state) => state.addToast);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: { email: '', password: '' },
        mode: 'onChange'
    });

    const loginMutation = useMutation({
        mutationFn: (data: LoginFormInputs) => AuthService.login(data),
        onSuccess: (res) => {
            addToast({ message: MESSAGES.LOGIN_SUCCESS, severity: 'success' });
            localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
            router.replace(CLIENT_MAP.ROOT);
        },
        onError: (error: unknown) => {
            addToast({ message: String(error), severity: 'error' });
        },
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
        loginMutation.mutate(data);
    };

    const handleSocialLogin = (provider: string) => {
        alert(provider);
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        loginMutation,
        handleSocialLogin,
    }
}