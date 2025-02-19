'use client';

import { Fragment } from 'react';
import { Snackbar, Alert } from '@mui/material';

import { useToastStore } from '../model/useToastStore';

export const ToastContainer = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <Fragment>
            {toasts.map((toast) => (
                <Snackbar
                    key={toast.id}
                    open={true}
                    autoHideDuration={6000}
                    onClose={() => removeToast(toast.id)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => removeToast(toast.id)}
                        severity={toast.severity}
                        sx={{ width: '100%' }}
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </Fragment>
    );
}