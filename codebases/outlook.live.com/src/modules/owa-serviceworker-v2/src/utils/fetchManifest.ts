import * as trace from './trace';
import type { ClientMessage } from 'owa-serviceworker-common';
import type Manifest from '../types/Manifest';
import { validateFetch } from './validate';

const MaxManifestRetry = 3;

export default function fetchManifest(
    message: ClientMessage,
    retryCount: number
): Promise<Manifest> {
    trace.log('Fetching manifest');
    const manifestHeaders: Headers = new Headers();
    if (message.language) {
        manifestHeaders.append('x-user-language', message.language.toLowerCase());
    }
    if (message.dynamicRequestHeaders) {
        for (const headerKey of Object.keys(message.dynamicRequestHeaders)) {
            manifestHeaders.append(headerKey, message.dynamicRequestHeaders[headerKey]);
        }
    }

    if (message.manifestUrl.indexOf('owa/') > -1) {
        message.manifestUrl = message.manifestUrl.replace('owa/', 'mail/');
    }

    return self
        .fetch(message.manifestUrl, {
            credentials: 'same-origin',
            redirect: 'manual',
            headers: manifestHeaders,
        })
        .then((response: Response) => {
            validateFetch(response, 'CantFetchManifest');
            return response.json();
        })
        .catch(error => {
            trace.warn(`Fetching manifest: ${error.message},retryCount:${retryCount}`);
            if (retryCount < MaxManifestRetry) {
                return fetchManifest(message, ++retryCount);
            } else {
                return Promise.reject(error);
            }
        });
}
