/*
 * UrlUtils.ts
 */

export interface IQueryParams {
	[key: string]: any;
}

export function buildQueryParameters(keyAndValues: IQueryParams, encodeValueAsURI: boolean = true): string {
	let queryParamsString = "";
	for (const key in keyAndValues || []) {
		if (keyAndValues.hasOwnProperty(key)) {
			const value = keyAndValues[key];
			if (value !== null && value !== undefined && typeof value !== "object") {
				const prefix = !queryParamsString ? "" : "&";
				const encodedValue = encodeValueAsURI ? encodeURIComponent(value) : value;
				const queryParamItem = `${key}=${encodedValue}`;
				queryParamsString += prefix + queryParamItem;
			}
		}
	}

	return queryParamsString;
}
