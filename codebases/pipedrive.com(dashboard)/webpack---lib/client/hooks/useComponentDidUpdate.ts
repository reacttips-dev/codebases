import { useRef, useEffect, DependencyList, EffectCallback } from 'react';

export function useComponentDidUpdate(effect: EffectCallback, dependencies?: DependencyList) {
	const isFirstRender = useRef(true);
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;

			return;
		}

		return effect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);
}
