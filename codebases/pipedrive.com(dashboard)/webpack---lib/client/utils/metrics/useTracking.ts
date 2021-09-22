import { useContext } from 'react';

import { MetricsContext } from './MetricsProvider';

export function useTracking() {
	const context = useContext(MetricsContext);
	if (context == null) {
		throw new Error('useTracking: tracking context not set');
	}

	return context;
}
