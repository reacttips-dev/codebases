import React, { useLayoutEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useResizeObserve = (ref: React.RefObject<HTMLElement>) => {
	const initialWidth = ref?.current?.clientWidth ?? (window?.innerWidth || 0);
	const [width, setWidth] = React.useState(initialWidth);

	const handleWidth = () => {
		if (ref.current) {
			setWidth(ref.current.clientWidth);
		}
	};

	useLayoutEffect(() => {
		const resizeObserver = new ResizeObserver(handleWidth);

		if (ref.current) {
			resizeObserver.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				resizeObserver.unobserve(ref.current);
			}
		};
	}, [ref]);

	return width;
};

export default useResizeObserve;
