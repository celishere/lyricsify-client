import { Dispatch, ForwardedRef, MutableRefObject, SetStateAction } from "react";

export const initRef = <T extends HTMLElement>(
    setFunc: Dispatch<SetStateAction<T | null>>,
    ref: ForwardedRef<T>
) => {
    return (element: T | null) => {
        setFunc(element);

        if (typeof ref === 'function') {
            ref(element);
        } else if (ref) {
            (ref as MutableRefObject<T | null>).current = element;
        }
    };
}