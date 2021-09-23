import {
    useEffect,
    useState
} from 'react';

/**
 * Debounce a value change.
 *
 * @template T
 * @param {T} value Current value to debounce.
 * @param {number} delay Length of time to debounce the value.
 * @returns {T} Debounced value.
 */
export default function useDebouncedValue(value, delay) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounced(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay]);

    return debounced;
}