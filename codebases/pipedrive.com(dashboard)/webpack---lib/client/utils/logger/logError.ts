import Logger from '@pipedrive/logger-fe';
import { AxiosError } from 'axios';

export const LEADBOX_FACILITY_NAME = 'leadbox-fe';

function isError(error: Error | string): error is Error {
	return 'stack' in (error as Error);
}

function isAxiosError(error: Error | string): error is AxiosError {
	return isError(error) && 'isAxiosError' in error;
}

function extractCorrelationId(error: Error | string): string | undefined {
	if (!isAxiosError(error)) {
		return;
	}

	return error?.response?.headers['x-correlation-id'];
}

type LogError = {
	logger: Logger;
	error: Error | string;
	facility: string;
	additionalData: Record<string, unknown>;
};

export function logError({ logger, error, facility, additionalData = {} }: LogError) {
	const {
		navigator: { userAgent },
		location,
	} = window;

	const data = {
		stack: isError(error) ? error.stack : '',
		url: location.href,
		userAgent,
		...{ additionalData },
		cid: extractCorrelationId(error),
	};

	logger.remote('error', error.toString(), data, facility);
}
