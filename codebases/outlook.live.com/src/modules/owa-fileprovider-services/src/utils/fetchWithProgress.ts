import { HttpReadyState } from 'owa-http-status-codes';

export type FetchRequestInit = Pick<RequestInit, 'body' | 'method' | 'headers'>;
export type FetchResponse = Pick<Response, 'status' | 'text'>;
export function fetchWithProgress<T>(
    url: string,
    onProgressHandler: (event: ProgressEvent) => void,
    requestInit: FetchRequestInit = { method: 'POST' }
): Promise<FetchResponse> {
    return new Promise<FetchResponse>((resolve, reject) => {
        const { method, body, headers } = requestInit;
        const request: XMLHttpRequest = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === HttpReadyState.Done) {
                resolve({
                    status: request.status,
                    text: () => Promise.resolve(request.responseText),
                });
            }
        };

        request.ontimeout = () => {
            reject(new Error('Request timed out'));
        };

        request.onerror = () => {
            reject(new Error('Request failed'));
        };

        request.onabort = () => {
            reject(new Error('Request aborted'));
        };

        if (onProgressHandler) {
            request.upload.onprogress = onProgressHandler;
        }

        request.open(method, url, true);
        new Headers(headers).forEach((val: string, key: string) => {
            request.setRequestHeader(key, val);
        });

        if (body) {
            request.send(body);
        } else {
            request.send();
        }
    });
}
