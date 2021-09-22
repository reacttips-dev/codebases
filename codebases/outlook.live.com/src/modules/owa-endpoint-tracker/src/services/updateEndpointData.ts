import { makePostRequest } from 'owa-ows-gateway';
import type { OutlookEndpointDataItem } from '../schema/OutlookEndpointDataItem';

const UPSERT_ENDPOINT_TRACKER_URL: string = 'ows/api/v1/EndpointTracker';

export function updateEndpointData(endpointData: OutlookEndpointDataItem): void {
    makePostRequest(UPSERT_ENDPOINT_TRACKER_URL, endpointData);
}
