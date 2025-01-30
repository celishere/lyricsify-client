import { Toast } from "src/app/providers/ToastProvider/types/Toast.type";

export type ToastContextType = {
    addToast: (toast: Toast) => void;
    removeToast: (id?: string) => void;
    toasts: Toast[];
    base: (props: Toast) => string;
    error: (props: Toast) => string;
    success: (props: Toast) => string;
};