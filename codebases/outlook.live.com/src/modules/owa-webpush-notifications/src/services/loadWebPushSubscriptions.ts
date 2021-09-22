import { makeGetRequest } from 'owa-ows-gateway';
import type OwaPushSubscription from '../schema/OwaPushSubscription';

const GET_WEB_PUSH_SUBSCRIPTIONS_URL: string = 'ows/beta/webpushsubscriptions';

export default function loadWebPushSubscriptions(): Promise<OwaPushSubscription[]> {
    return makeGetRequest(GET_WEB_PUSH_SUBSCRIPTIONS_URL).then(response => response.subscriptions);
}
