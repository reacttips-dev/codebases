import { useRef, useEffect, useCallback } from 'react';

/**
 * Generates memoized callbacks for setting a timer, clearing a timer, and checking whether the timer is active.
 *
 * Ensures that only a single timer is active at a time and that it is cleaned up on component unmount to avoid memory leaks.
 */
export function useCustomTimeout() {
    const timerId = useRef<number>();

    const clearTimer = useCallback(() => {
        window.clearTimeout(timerId.current);
        timerId.current = 0;
    }, []);

    const setTimer = useCallback(
        <TCallback extends (...args: any) => any>(
            callback: TCallback,
            timeout: number,
            ...params: Parameters<TCallback>
        ) => {
            clearTimer();
            timerId.current = window.setTimeout(
                (...args: Parameters<TCallback>) => {
                    timerId.current = 0;
                    callback(...args);
                },
                timeout,
                ...params
            );
        },
        [clearTimer]
    );

    const isTimerActive = useCallback((): boolean => !!timerId.current, []);

    // Clear timer on unmount
    useEffect(() => clearTimer, []);

    return [setTimer, clearTimer, isTimerActive] as const;
}
