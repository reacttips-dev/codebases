import { useRef, useEffect } from 'react';

export default function usePreviousProps(props: any) {
	const ref = useRef(null);

	useEffect(() => {
		ref.current = props;
	});

	return ref.current;
}
