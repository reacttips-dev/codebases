import { useMemo } from 'react';

function useTopSpace() {
	const { offsetHeight, offsetTop } = document.getElementById('froot-header');

	return useMemo(() => offsetHeight + offsetTop, [offsetHeight, offsetTop]);
}

export default useTopSpace;
