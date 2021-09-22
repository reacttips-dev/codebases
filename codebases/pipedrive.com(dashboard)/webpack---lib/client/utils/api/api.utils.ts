import queryString from 'query-string';

export const CONVERT_API_PREFIX = '/api/v1/convert-to-lead';

export const getCookie = (name: string) => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);

	if (parts.length !== 2) {
		return '';
	}

	const lastPart = parts.pop();

	if (!lastPart) {
		return '';
	}

	return lastPart.split(';').shift();
};

export const getUrl = <T>(url: string, optionalParams?: T) => {
	const params = {
		...optionalParams,
		session_token: getCookie('pipe-session-token'),
		strict_mode: true,
	};

	const stringifiedParams = queryString.stringify(params);

	return `${url}?${stringifiedParams}`;
};
