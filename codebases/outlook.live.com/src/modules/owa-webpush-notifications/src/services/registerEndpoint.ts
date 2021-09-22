import { makePostRequest } from 'owa-ows-gateway';
import type OwaPushSubscription from '../schema/OwaPushSubscription';

const POST_WEB_PUSH_SUBSCRIPTION_URL: string = 'ows/beta/webpushsubscriptions';

export default async function registerEndpoint(endPoint: OwaPushSubscription): Promise<boolean> {
    return makePostRequest(POST_WEB_PUSH_SUBSCRIPTION_URL, endPoint).then(
        response => response.registered
    );
}
