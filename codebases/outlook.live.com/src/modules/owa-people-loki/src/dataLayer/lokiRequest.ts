import { fetchLokiConfigAsync } from '../services/fetchLokiConfigAsync';
import * as lokiContext from '../lokiContext';
import { getAuthToken } from './../auth/requestAuthTokenHandler';

export type HttpVerb = 'PUT' | 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function lokiRequest(
    method: HttpVerb,
    path: string,
    queryParameters?: { [key: string]: string },
    body?: any,
    headers?: Headers
): Promise<Response> {
    const config = await fetchLokiConfigAsync();
    const authToken = (await getAuthToken()).getValue();

    if (!headers) {
        headers = new Headers();
    }

    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    headers.set('authorization', `Bearer ${authToken}`);

    headers.set('X-ClientCorrelationId', lokiContext.clientCorrelationId);
    headers.set('X-ClientType', lokiContext.clientType);
    headers.set('X-ClientScenario', lokiContext.clientScenario);
    headers.set('X-RefererUrl', '');
    headers.set(
        'X-ClientVersion',
        `16.${lokiContext.clientVersion.substr(0, 4)}.${lokiContext.clientVersion.substr(
            4,
            4
        )}.${lokiContext.clientVersion.substr(8)}`
    );

    const url = addQueryParametersToUrl(config.LokiUrl + path, queryParameters);

    const requestInit: RequestInit = {
        method: method,
        headers: headers,
        body: body,
    };

    return fetch(url, requestInit);
}

function addQueryParametersToUrl(url: string, queryParameters: { [key: string]: string }): string {
    const parametersKeys = Object.keys(queryParameters);

    if (parametersKeys.length === 0) {
        return url;
    }

    const parameters: string[] = [];
    parametersKeys.forEach(key => {
        const value = queryParameters[key];
        parameters.push(key + '=' + encodeURIComponent(value || ''));
    });

    return url + '?' + parameters.join('&');
}
