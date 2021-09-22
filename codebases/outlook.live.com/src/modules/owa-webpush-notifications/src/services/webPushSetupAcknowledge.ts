import { makePostRequest } from 'owa-ows-gateway';
import * as trace from 'owa-trace';

const POST_WEB_PUSH_SUBSCRIPTION_URL: string = 'ows/api/webpushsetupacknowledge/processItem';

export async function webPushSetupAcknowledge(
    request: WebPushSetupAcknowledgeRequest
): Promise<boolean> {
    try {
        await makePostRequest(POST_WEB_PUSH_SUBSCRIPTION_URL, request);
    } catch (e) {
        trace.errorThatWillCauseAlert(`Error while web push setup ack, error: ${e}`);
    }

    return Promise.resolve(true);
}
