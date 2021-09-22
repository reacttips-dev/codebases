import { makePostRequest } from 'owa-ows-gateway';

const POST_WEB_PUSH_SUBSCRIPTION_URL: string = 'ows/beta/webpushsubscriptions/delete';

export default function unregisterEndpoint(endPoint: string, clientId?: string): Promise<boolean> {
    let request: UnregisterEndpointRequest = { endpoint: endPoint, clientId: clientId };
    return makePostRequest(POST_WEB_PUSH_SUBSCRIPTION_URL, request).then(
        (response: UnregisterEndpointResponse) => !!response.unregistered
    );
}
