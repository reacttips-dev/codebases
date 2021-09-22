import cookies from './cookies';
import { toGlobalId } from '@adeira/graphql-global-id';
import pdFetch, { getCookieValue } from '@pipedrive/fetch';

function apiGet(url, options) {
	const reqOpts = getDefaultReqOpts();

	apiRequest(url, options, reqOpts);
}

function apiPut(url, options) {
	const reqOpts = getDefaultReqOpts();

	reqOpts.method = 'PUT';
	reqOpts.body = JSON.stringify(options.payload);

	apiRequest(url, options, reqOpts);
}

function apiPost(url, options) {
	const reqOpts = getDefaultReqOpts();

	reqOpts.method = 'POST';
	reqOpts.body = JSON.stringify(options.payload);

	apiRequest(url, options, reqOpts);
}

function apiDelete(url) {
	url += `${url.match(/\?/) ? '&' : '?'}session_token=${cookies.get(
		'pipe-session-token'
	)}&strict_mode=true`; // NOSONAR
	const reqOpts = getDefaultReqOpts();

	reqOpts.method = 'DELETE';

	return fetch(url, reqOpts);
}

function getDefaultReqOpts() {
	return {
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Cache-control': 'no-cache',
			'Pragma': 'no-cache'
		},
		method: 'GET'
	};
}

function apiRequest(url, options, reqOpts) {
	url += `${url.match(/\?/) ? '&' : '?'}session_token=${cookies.get(
		'pipe-session-token'
	)}&strict_mode=true`; // NOSONAR

	return fetch(url, reqOpts)
		.then((response) => {
			if (!response.ok) {
				options.error && options.error(response);

				return response;
			}

			return response.json();
		})
		.then((response) => {
			if (response.success || options.isGraphQl) {
				options.success(response.data, response.related_objects || {});
			}

			return response;
		});
}

export function apiGetSuggestedDeals(ids, options) {
	return apiGet(`/api/v1/deals/suggestedByPersonIds?ids=${ids}`, options);
}

export function apiGetSuggestedLeads(ids, options) {
	return apiGet(
		`/api/v1_internal/leads?personIds=${ids}&sortByColumn=time_updated&sortDirection=DESC&limit=10`,
		options
	);
}

export const apiGetLinkedPersons = (ids, options) => {
	return apiGet(`/api/v1/persons/list?ids=${ids}`, options);
};

export function apiGetLinkedDeal(id, options) {
	return apiGet(`/api/v1/deals/${id}`, options);
}

export function apiGetLead(id, options) {
	return apiGet(`/api/v1/leads/${id}`, options);
}

export function apiGetLinkedLead(id, options) {
	options.isGraphQl = true;
	options.payload = {
		query:
			'query getLead($leadGlobalId: ID!) {\n  node(id: $leadGlobalId) {\n    ... on Lead {\n      id: id(opaque: false)\n      title\n      isActive\n      owner {\n        id: id(opaque: false)\n      name\n      }\n      activities(activityStatus: PLANNED) {\n      id: id(opaque: false)\n      subject\n      due_time: dueTime\n      due_date: dueDate\n      done: isDone\n      type\n      update_time: updateTime\n      }\n      deal {\n        ... on DealInfo {\n          value {\n            amount\n            currency {\n              code\n            }\n          }\n        }\n      }\n      person {\n        id: id(opaque: false)\n      name\n      }\n      organization {\n        id: id(opaque: false)\n      name\n      }\n    }\n  }\n}\n', // NOSONAR
		variables: {
			leadGlobalId: toGlobalId('Lead', id)
		},
		operationName: 'getLead'
	};

	return apiPost(`/leads-graphql`, options);
}

export function apiGetPerson(id, options) {
	return apiGet(`/api/v1/persons/${id}`, options);
}

export function apiGetOrganization(id, options) {
	return apiGet(`/api/v1/organizations/${id}`, options);
}

export function apiGetStages(pipelineId, options) {
	return apiGet(`/api/v1/stages?pipeline_id=${pipelineId}`, options);
}

export function apiPutDeal(dealId, options) {
	return apiPut(`/api/v1/deals/${dealId}`, options);
}

export function apiLinkDealOrLead(threadId, options) {
	return apiPut(`/api/v1/mailbox/mailThreads/${threadId}`, options);
}

export function apiGetDealLeadSearchResults(text, options) {
	const url = `/api/v1/itemSearch?term=${encodeURIComponent(
		text
	)}&item_types=deal,lead,person,organization&search_for_related_items=1&limit=50`;

	return apiGet(url, options);
}

export function apiGetActivity(id, options) {
	return apiGet(`/api/v1/activities/${id}`, options);
}

export function apiPutActivity(id, options) {
	return apiPut(`/api/v1/activities/${id}`, options);
}

export function apiGetContactSearchResults(text, options) {
	return apiGet(
		`/api/v1/itemSearch?item_types=person&term=${encodeURIComponent(text)}&limit=50`,
		options
	);
}

export function apiPutPerson(id, options) {
	return apiPut(`/api/v1/persons/${id}`, options);
}

export function apiGetTemplates(language, options) {
	return apiGet(
		`/api/v1/mailbox/mailTemplates?language=${language}&include_owner_name=true`,
		options
	);
}

export function apiGetTemplate(id, language, options = {}) {
	const url = `/api/v1/mailbox/mailTemplates/${id}/content?language=${language}`;

	// return promise if no callbacks
	if (!options.success && !options.error) {
		return pdFetch(url);
	}

	return apiGet(url, options);
}

export function apiPutTemplate(id, options) {
	return apiPut(`/api/v1/mailbox/mailTemplates/${id}/?include_owner_name=true`, options);
}

export function apiPostTemplate(options) {
	return apiPost(`/api/v1/mailbox/mailTemplates?include_owner_name=true`, options);
}

export function apiDeleteTemplate(id) {
	return apiDelete(`/api/v1/mailbox/mailTemplates/${id}`);
}

function fetchWithProgress(url, opts = {}, onProgress) {
	return new Promise((res, rej) => {
		const xhr = new XMLHttpRequest();

		xhr.open(opts.method || 'get', url);

		Object.keys(opts.headers || {}).forEach((header) => {
			xhr.setRequestHeader(header, opts.headers[header]);
		});

		xhr.onload = (e) => {
			if ([200, 201].includes(e.target.status)) {
				try {
					return res(JSON.parse(e.target.responseText).data);
				} catch (err) {
					return rej(err);
				}
			} else {
				rej(e.target);
			}
		};
		xhr.onerror = rej;

		if (xhr.upload && onProgress) {
			xhr.upload.addEventListener('progress', (ev) => {
				onProgress(ev, xhr);
			});
		}

		xhr.send(opts.body);
	});
}
/**
 * Posting file
 * @param {} file - eg input[type="file"] event.target.files[0]
 * @param {Object} [data] - additional data for passing to request (eg template_id, deal_id)
 */
export function apiPostFile(file, data = {}, onProgress) {
	const url = `/api/v1/mailbox/mailAttachments?session_token=${getCookieValue(
		'pipe-session-token'
	)}&strict_mode=true`; // NOSONAR
	const defaultReqOpts = getDefaultReqOpts();
	const formData = new FormData();

	formData.append('file', file);

	Object.keys(data).forEach((key) => {
		formData.append(key, data[key]);
	});

	delete defaultReqOpts.headers['Content-Type'];
	const reqOptions = {
		...defaultReqOpts,
		method: 'POST',
		body: formData
	};

	return fetchWithProgress(url, reqOptions, onProgress);
}

export function apiGetFiles(templateId) {
	const url = `/api/v1/mailbox/mailAttachments?mail_template_ids=${templateId}`;

	return pdFetch(url);
}

export function apiDeleteFile(fileId) {
	const url = `/api/v1/mailbox/mailAttachments/${fileId}`;
	const reqOptions = { method: 'delete' };

	return pdFetch(url, reqOptions);
}

export function apiPutFile(fileId, body = {}) {
	const url = `/api/v1/mailbox/mailAttachments/${fileId}`;
	const reqOptions = {
		method: 'put',
		body: JSON.stringify(body)
	};

	return pdFetch(url, reqOptions);
}
