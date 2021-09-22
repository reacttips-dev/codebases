import { getGuid } from 'owa-guid';
import { makePatchRequest } from 'owa-ows-gateway';
import { persistedAddinEndpoint } from './constants';

export default function savePersistedAddins(mode: string, addinId: string, commandId: string) {
    const correlationId = getGuid();
    makePatchRequest(
        persistedAddinEndpoint,
        {
            Addin: {
                mode,
                addinId,
                commandId,
            },
        },
        correlationId
    );
}
