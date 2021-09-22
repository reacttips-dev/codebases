import { useEffect } from 'react';

export function useClickOutside(ref, callback) {
	const handleClick = (e) => {
		if (!ref.current || ref.current.contains(e.target) || hasSearchElementClass(e)) {
			return;
		}
		return callback();
	};

	// when component lost focus and does not receive a click event (ie iframe is clicked)
	const onWindowBlur = () =>
		setImmediate(() => {
			// check that user does not change the tab or window and staying on the page
			if (!document.hidden) {
				return callback();
			}
		});

	useEffect(() => {
		document.addEventListener('click', handleClick);
		window.addEventListener('blur', onWindowBlur);
		return () => {
			document.removeEventListener('click', handleClick);
			window.removeEventListener('blur', onWindowBlur);
		};
	});
}

export const SEARCH_MODAL_ELEMENT = 'search_modal_element';

function hasSearchElementClass(e) {
	return !!(e.target?.className?.includes && e.target.className.includes(SEARCH_MODAL_ELEMENT));
}
