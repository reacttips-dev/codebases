import { useEffect, useState } from 'react';

export function useMount(
	isLoading: boolean,
	onAfterClose?: () => void,
	onMounted?: () => void,
): [boolean, boolean, (isVisible: boolean) => void, (isMounted: boolean) => void] {
	const [isVisible, setVisible] = useState(true);
	const [isMounted, setMounted] = useState(true);

	useEffect(() => {
		if (!isMounted && typeof onAfterClose === 'function') {
			onAfterClose();
		}
	}, [isMounted]);

	useEffect(() => {
		if (!isLoading && isVisible && onMounted) {
			onMounted();
		}
	}, [isLoading, isVisible]);

	return [isVisible, isMounted, setVisible, setMounted];
}
