import { makeGetRequest } from 'owa-ows-gateway';
import type { UserOutlookClients } from '../store/schema/UserOutlookClients';
const ENDPOINT_TRACKER_URL: string = 'ows/api/v1/EndpointTracker/allendpoints';

export function getUserOutlookClients(): Promise<UserOutlookClients> {
    return makeGetRequest(ENDPOINT_TRACKER_URL);
}
