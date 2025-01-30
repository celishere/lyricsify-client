import { createContext, useState, FC, ReactNode } from 'react';

import { v4 } from "uuid";

import { Toasts } from "../Toasts";

import { Toast } from "../../types/Toast.type";
import { ToastContextType } from "../../types/ToastContext.type";

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Toast) => {
        setToasts((prevToasts) => [...prevToasts, { ...toast }]);
        setTimeout(() => removeToast(toast.id), toast.delay ? toast.delay : 3000);
    };

    const removeToast = (id?: string, force: boolean = false) => {
        setToasts((prevToasts) =>
            prevToasts.map((toast) => {
                if (toast.id === id) {
                    if (!force && !toast.isDeleted) {
                        setTimeout(() => removeToast(toast.id, true), 300);

                        return { ...toast, isDeleted: true };
                    } else {
                        return undefined;
                    }
                }

                return toast;
            }).filter(Boolean) as Toast[]
        );
    };

    const base = (props: Toast) => {
        const id = v4();

        addToast({ ...props, id, type: 'base' });
        return id;
    };

    const error = (props: Toast) => {
        const id = v4();

        addToast({ ...props, id, type: 'error' });
        return id;
    };

    const success = (props: Toast) => {
        const id = v4();

        addToast({ ...props, id, type: 'success' });
        return id;
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast, toasts, base, error, success }}>
            { children }
            <Toasts />
        </ToastContext.Provider>
    );
};