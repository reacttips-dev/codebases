import { useEffect } from 'react';

export function useWindowResize(onResize) {
	useEffect(() => {
		window.addEventListener('resize', onResize);
		onResize();

		return () => window.removeEventListener('resize', onResize);
	}, [onResize]);
}
