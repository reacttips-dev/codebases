import { getGuid } from 'owa-guid';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import { makeGetRequest } from 'owa-ows-gateway';
import { persistedAddinEndpoint } from './constants';

export default async function loadPersistedAddins(): Promise<string> {
    const correlationId = getGuid();
    const response = await makeGetRequest(
        persistedAddinEndpoint,
        correlationId,
        true /* returnFullResponse */
    );
    if (isSuccessStatusCode(response.status)) {
        return response.text();
    }
    return '{}';
}
