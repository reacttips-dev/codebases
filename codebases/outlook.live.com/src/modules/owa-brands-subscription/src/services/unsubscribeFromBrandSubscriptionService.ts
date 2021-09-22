import { format } from 'owa-localize';
import { makePatchRequest } from 'owa-ows-gateway';

const UNSUBSCRIBE_URL: string = 'ows/api/beta/subscriptions/{0}/unsubscribe';

function unsubscribeFromBrandSubscriptionService(
    smtpIdentifier: string,
    unsubscribeSilentUris: string[]
): Promise<Response> {
    return makePatchRequest(
        format(UNSUBSCRIBE_URL, smtpIdentifier) /* requestURL */,
        {
            UnsubscribeSilentUris: unsubscribeSilentUris /* requestObject */,
            ShouldReturnFailedUris: true,
        },
        null /* correlationId */,
        true /* returnFullResponse */
    );
}

export default unsubscribeFromBrandSubscriptionService;
