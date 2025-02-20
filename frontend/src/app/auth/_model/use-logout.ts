'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { AuthService } from './auth.service';
import { ACCESS_TOKEN_KEY } from './auth.constants';
import { MESSAGES } from '@/common/constants';
import { useToastStore } from '@/components/toast';

export const useLogout = () => {
    const router = useRouter();
    const addToast = useToastStore((state) => state.addToast);

    const logoutMutation = useMutation({
        mutationFn: () => AuthService.logout(),
        onSuccess: () => {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            addToast({ message: MESSAGES.LOGOUT_SUCCESS, severity: 'success' });
            router.refresh();
        },
        onError: (error: unknown) => {
            addToast({ message: String(error), severity: 'error' });
        },
    });

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
    };

    return { handleLogout, logoutIsPending: logoutMutation.isPending };
};