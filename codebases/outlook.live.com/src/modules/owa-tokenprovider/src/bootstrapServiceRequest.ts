import { updateServiceConfig } from 'owa-service/lib/config';
import getIndexedPath from 'owa-url/lib/getIndexedPath';

export function bootstrapServiceRequest() {
    // Always make a request to user's backend.
    let baseUrl = getIndexedPath('/owa');
    updateServiceConfig({
        baseUrl: baseUrl,
    });
}
