import { useRef, useEffect, DependencyList } from 'react';

interface UseIntervalOptions {
	runImmediately: boolean;
	deps?: DependencyList;
}
// copied over from leadbooster
// Inspired by Dan Abramov - https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: () => void, ms: number, options?: UseIntervalOptions) {
	const savedCallbackRef = useRef<() => void>();
	const intervalRef = useRef<number>();

	const clear = () => {
		clearInterval(intervalRef.current);
	};

	// Remember the latest callback.
	useEffect(() => {
		savedCallbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		const tick = () => {
			savedCallbackRef.current && savedCallbackRef.current();
		};

		if (options?.runImmediately) {
			tick();
		}

		const interval = window.setInterval(tick, ms);
		intervalRef.current = interval;

		return () => clear();
		// eslint-disable-next-line
	}, options?.deps ?? []);

	return clear;
}
