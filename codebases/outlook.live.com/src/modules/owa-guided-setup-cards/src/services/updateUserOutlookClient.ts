import { makePostRequest } from 'owa-ows-gateway';
import type { UserOutlookClient } from '../store/schema/UserOutlookClients';
const UPSERT_ENDPOINT_TRACKER_URL: string = 'ows/api/v1/EndpointTracker';

export function updateUserOutlookClient(client: UserOutlookClient): Promise<any> {
    return makePostRequest(UPSERT_ENDPOINT_TRACKER_URL, client);
}
