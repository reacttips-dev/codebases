import { getShareHash } from '../../utils/helpers';

export enum FetchPolicy {
	NETWORK_ONLY = 'network-only',
	CACHE_FIRST = 'cache-first',
}

export const getCookie = (name: string) => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);

	if (parts.length === 2) {
		return parts.pop().split(';').shift();
	}

	return '';
};

export const getUrl = (url: string) => {
	const regexp = /\?/;
	const sessionToken = `session_token=${getCookie(
		'pipe-session-token',
	)}&strict_mode=true`;
	const urlParam = `${url.match(regexp) ? '&' : '?'}`;

	return `${url}${urlParam}${sessionToken}`;
};

export const getInsightsApiFetchPolicy = (isNewReport = false) => {
	return isNewReport ? FetchPolicy.NETWORK_ONLY : FetchPolicy.CACHE_FIRST;
};

export const headers = window?.app?.isPublic
	? {
			headers: {
				'insights-public-hash': getShareHash(),
			},
	  }
	: {};
