import { useRef, useEffect } from 'react';

export function useAutoFocus<T extends HTMLElement>(shouldFocus: boolean) {
    const pillRef = useRef<T>();

    useEffect(() => {
        if (shouldFocus) {
            pillRef.current.focus();
        }
    });

    return pillRef;
}
