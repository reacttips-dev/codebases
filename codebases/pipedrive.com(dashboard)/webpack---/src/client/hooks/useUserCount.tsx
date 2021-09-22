import { useEffect, useState } from 'react';
import useUserDataContext from './useUserDataContext';

export function useUserCount(countKey) {
	const { user } = useUserDataContext();
	const counts = user?.counts || null;
	const [count, setCount] = useState(counts?.get(countKey) || 0);

	useEffect(() => {
		if (!counts) {
			return;
		}

		setCount(counts.get(countKey));

		const changeKey = `change:${countKey}`;

		function handleChange(target, newCount) {
			setCount(newCount);
		}

		counts.on(changeKey, handleChange);

		return () => {
			counts.off(changeKey, handleChange);
		};
	}, [countKey, counts]);

	return count;
}
