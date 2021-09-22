import { useState, useEffect, useRef } from 'react';

export function useHover({ mouseEnterDelay = 200 } = {}): [React.Ref<HTMLDivElement>, boolean] {
	const [hovered, setHovered] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	let mouseEnterTimeout: number;

	function handleMouseEnter() {
		mouseEnterTimeout = window.setTimeout(() => setHovered(true), mouseEnterDelay);
	}

	function handleMouseLeave() {
		setHovered(false);
		window.clearTimeout(mouseEnterTimeout);
	}

	useEffect(() => {
		const node = ref.current;

		if (node) {
			node.addEventListener('mouseenter', handleMouseEnter);
			node.addEventListener('mouseleave', handleMouseLeave);

			return () => {
				node.removeEventListener('mouseenter', handleMouseEnter);
				node.removeEventListener('mouseleave', handleMouseLeave);
			};
		}
	}, [ref.current]);

	return [ref, hovered];
}

export default useHover;
