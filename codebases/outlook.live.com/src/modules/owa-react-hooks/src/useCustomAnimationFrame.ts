import { useRef, useEffect, useCallback } from 'react';

/**
 * Generates memoized callbacks for requesting a frame, clearing a frame, and checking whether a request is active.
 *
 * Ensures that only a single request is active at a time and that it is cleaned up on component unmount to avoid memory leaks.
 */
export function useCustomAnimationFrame() {
    const requestId = useRef<number>(0);

    const clearFrame = useCallback(() => {
        window.cancelAnimationFrame(requestId.current);
        requestId.current = 0;
    }, []);

    const requestFrame = useCallback(
        (callback: () => void) => {
            clearFrame();
            requestId.current = window.requestAnimationFrame(() => {
                requestId.current = 0;
                callback();
            });
        },
        [clearFrame]
    );

    const isRequestActive = useCallback((): boolean => !!requestId.current, []);

    // Clear frame on unmount
    useEffect(() => clearFrame, []);

    return [requestFrame, clearFrame, isRequestActive] as const;
}
