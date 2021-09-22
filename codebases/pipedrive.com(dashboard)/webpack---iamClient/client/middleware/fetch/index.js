// Polyfill for `fetch`
import 'whatwg-fetch';
import { forEach } from 'lodash';
import Cookies from 'universal-cookie';

let currentRequests = {};

export const encodeGetParameters = (params) => {
	if (!params) {
		return '';
	}

	const query = Object.keys(params)
		.map((key) => {
			return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
		})
		.join('&');

	return `?${query}`;
};

export const createPostBody = (params) => {
	if (!params) {
		return JSON.stringify({});
	}

	const body = JSON.stringify(params);

	return body;
};

export const createHeaders = (requestMethod, extraHeaders) => {
	const headers = new Headers();

	if (requestMethod === 'POST') {
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');
	}

	if (Array.isArray(extraHeaders)) {
		forEach(extraHeaders, (header) => {
			headers.append(header.header, header.value);
		});
	}

	return headers;
};

export default store => next => action => {
	let xhr;

	if (action.meta && action.meta.fetch) {
		if (action.meta.fetch.invalidate) {
			currentRequests = {};
		}

		const request = action.meta.fetch.request;

		if (request) {
			currentRequests[action.type] = request;

			const uriPrefix = store.getState().settings.fetchUriPrefix;
			const fetchHeaders = store.getState().settings.fetchHeaders;

			let requestUrl = `${uriPrefix}${request.endpoint}`;

			let requestBody;

			const headers = createHeaders(request.method, fetchHeaders);

			let getParameters = request.withoutSessionToken ? {} : {
				session_token: (new Cookies()).get('pipe-session-token'),
			};

			if (request.method === 'POST') {
				requestBody = createPostBody(request.params);
			} else if (request.params) {
				getParameters = Object.assign(getParameters, request.params);
			}

			requestUrl += `${encodeGetParameters(getParameters)}`;

			xhr = fetch(requestUrl, {
				method: request.method,
				body: requestBody,
				headers,
				credentials: 'same-origin',
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Network response was not ok.');
					}

					const json = response.json();

					if (request !== currentRequests[action.type]) {
						return { rejected: true };
					}

					return json;
				})
				.then((json) => {
					if (json.rejected) {
						return;
					}

					if (json.hasOwnProperty('success') && !json.success) {
						throw new Error(json.data);
					}

					if (action.meta.fetch.success) {
						const successAction = action.meta.fetch.success(json.data || json);

						store.dispatch(successAction);
					}
				})
				.catch((e) => {
					if (action.meta.fetch.fail) {
						const err = e.toString();
						const failAction = action.meta.fetch.fail(err);

						store.dispatch(failAction);
					}
				});
		}
	}

	next(action);

	return xhr;
};
