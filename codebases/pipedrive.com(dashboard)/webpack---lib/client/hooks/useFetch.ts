import { useState, useEffect } from 'react';

export function useFetch<T>(loader: () => Promise<T>): { loading: boolean; response: T | null } {
	const [loading, setLoading] = useState<boolean>(false);
	const [response, setResponse] = useState<T | null>(null);
	const [, setError] = useState();

	useEffect(() => {
		setLoading(true);
		let didCancel = false;

		const fetchData = async () => {
			try {
				const res = await loader();

				if (!didCancel) {
					setResponse(() => res);
				}
			} catch (error) {
				if (!didCancel) {
					// https://github.com/facebook/react/issues/14981#issuecomment-468460187
					setError(() => {
						throw error;
					});
				}
			} finally {
				if (!didCancel) {
					setLoading(false);
				}
			}
		};
		fetchData();

		return () => {
			didCancel = true;
		};
	}, [loader]);

	return { loading, response };
}
