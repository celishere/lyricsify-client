import { useEffect, useRef, useCallback } from 'react';
import { RefObject } from 'react';

export const useOutsideClick = <T extends HTMLElement>(callback: () => void): RefObject<T> => {
    const ref = useRef<T | null>(null);

    const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            callback();
        }
    }, [callback]);

    useEffect(() => {
        document.addEventListener('mouseup', handleClickOutside);
        document.addEventListener('touchend', handleClickOutside);

        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
            document.removeEventListener('touchend', handleClickOutside);
        };
    }, [handleClickOutside]);

    return ref;
};
