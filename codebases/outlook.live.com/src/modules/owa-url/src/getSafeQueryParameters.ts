import { getQueryStringParameters, stringify } from 'owa-querystring';
import { removeHostedQueryParameters } from './removeHostedQueryParameters';

export function getSafeQueryParameters(): string {
    const paramPairs = getQueryStringParameters();
    removeHostedQueryParameters(paramPairs);
    const queryParams = stringify(paramPairs);
    return queryParams.length > 0 ? '?' + queryParams : '';
}
