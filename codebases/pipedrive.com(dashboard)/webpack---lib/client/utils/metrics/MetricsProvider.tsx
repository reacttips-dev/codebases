import React, { useMemo } from 'react';
import { API } from '@pipedrive/types';

import { Tracker } from './Tracker';

interface Props {
	readonly children: React.ReactNode;
	readonly pdMetrics: API['pdMetrics'];
}

export const MetricsContext = React.createContext<Tracker | null>(null);

export function MetricsProvider({ pdMetrics, children }: Props) {
	const tracker = useMemo(() => new Tracker(pdMetrics, 'leadbox'), [pdMetrics]);

	return <MetricsContext.Provider value={tracker}>{children}</MetricsContext.Provider>;
}
