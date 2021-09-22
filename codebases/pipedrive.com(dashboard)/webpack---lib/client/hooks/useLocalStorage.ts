import { useState, Dispatch, SetStateAction } from 'react';

/**
 * This essentially behaves like `useState` from React except it additionally persist the values
 * into local storage. Usage:
 *
 * ```
 * const [storedValue, setStoredValue] = useLocalStorage(
 * 		'storedValueKey',
 * 		'initialStoredValue' ?? null,
 * );
 * ```
 *
 * @see https://usehooks.com/useLocalStorage/
 */

export const getPrefixedKey = (key: string) => `pd:lead:inbox:${key}`;
export function useLocalStorage<S>(
	key: string,
	initialValue: S | (() => S),
): [S, Dispatch<SetStateAction<S>>, () => void] {
	const [storedValue, setStoredValue] = useState<S>(() => {
		try {
			const item = window.localStorage.getItem(key);

			return item ? JSON.parse(item) : initialValue;
		} catch {
			return initialValue;
		}
	});

	const setValue = (value: unknown) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch {
			// nevermind
		}
	};

	const clearValue = () => {
		window.localStorage.removeItem(key);
	};

	return [storedValue, setValue, clearValue];
}
