import { useState } from 'react';
import { getConvertSessionProgress } from 'Utils/api/ConvertSessionProgress';
import { useInterval } from 'Hooks/useInterval';

import { ConvertSessionResponse } from './types';

const INTERVAL = 2000; // 2 seconds

export function useConvertDealToLeadProgress(convertSession: ConvertSessionResponse | null): {
	dealsProcessed: number;
	dealsFailed: number;
	isFinished: boolean;
	percentage: number;
} {
	const [dealsProcessed, setDealsProcessed] = useState(0);
	const [dealsFailed, setDealsFailed] = useState(0);
	const clear = useInterval(
		async () => {
			if (!convertSession) {
				clear();

				return null;
			}
			const progress = await getConvertSessionProgress(convertSession.sessionId);
			setDealsProcessed(progress.processed);
			setDealsFailed(progress.errorCount);
			if (progress.processed + progress.errorCount === convertSession.total) {
				clear();
			}
		},
		INTERVAL,
		{ deps: [convertSession], runImmediately: true },
	);

	const isFinished = convertSession
		? convertSession.total
			? convertSession.total - (dealsProcessed + dealsFailed) === 0
			: true
		: false;

	const percentage = convertSession
		? convertSession.total
			? Math.floor((dealsProcessed / convertSession.total) * 100)
			: 0
		: 0;

	return { dealsProcessed, dealsFailed, isFinished, percentage };
}
