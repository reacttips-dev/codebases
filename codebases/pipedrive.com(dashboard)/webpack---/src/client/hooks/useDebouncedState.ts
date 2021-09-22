import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

export function useDebouncedState<T>(value: T): T {
	const [state, setState] = useState<T>(value);
	const debouncedHandler = useCallback(
		debounce((value: T) => {
			setState(value);
		}, 16),
		[],
	);

	useEffect(() => {
		debouncedHandler(value);
	}, [value]);

	return state;
}
