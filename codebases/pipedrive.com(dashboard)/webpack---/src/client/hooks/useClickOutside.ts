import React, { useEffect } from 'react';

type RefType = React.MutableRefObject<HTMLElement>;

interface Options {
	excludedRef?: RefType;
	enabled?: boolean;
}

export function useClickOutside(
	ref: RefType,
	callback: (param) => void,
	{ excludedRef, enabled = true }: Options = {},
) {
	function onOutsideClick(event) {
		const isExcluded = excludedRef?.current?.contains(event.target);

		if (!ref?.current?.contains(event.target) && !isExcluded) {
			return callback(false);
		}
	}

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const iframeClicked = (event) => {
			try {
				const isExcluded = excludedRef?.current?.contains(event.target);

				if (!ref?.current?.contains(event.target) && !isExcluded) {
					return callback(false);
				}
			} catch {
				// This is the default case. Not actually an error
				return callback(false);
			}
		};

		document.addEventListener('click', onOutsideClick, true);
		window.addEventListener('blur', iframeClicked, true);

		return () => {
			document.removeEventListener('click', onOutsideClick, true);
			window.removeEventListener('blur', iframeClicked, true);
		};
	}, [enabled]);
}

export default useClickOutside;
