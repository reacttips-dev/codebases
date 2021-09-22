import { useEffect, useCallback } from 'react';

export const useKeyPress = (targetKey: string, callback: (e: KeyboardEvent) => void) => {
	const downHandler = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === targetKey) {
				return callback(e);
			}
		},
		[targetKey, callback],
	);

	useEffect(() => {
		window.addEventListener<'keydown'>('keydown', downHandler);

		return () => {
			window.removeEventListener<'keydown'>('keydown', downHandler);
		};
	}, [downHandler]);
};
