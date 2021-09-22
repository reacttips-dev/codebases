import { get } from '@pipedrive/fetch';
import { CONVERT_API_PREFIX } from 'Utils/api/api.utils';

type ConvertSessionData = {
	sessionId: number;
	total: number;
	processed: number;
	errorCount: number;
};

export const getConvertSessionProgress = async (sessionId?: string): Promise<ConvertSessionData> => {
	const requestUrl = `${CONVERT_API_PREFIX}/session/${sessionId}`;

	try {
		const response = await get(requestUrl);

		if (response.success) {
			const data = await response.data;

			return data;
		}
		throw new Error('Fetching conversion progress failed');
	} catch (error) {
		throw new Error(error);
	}
};
