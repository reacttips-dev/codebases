import type ConsentStateType from 'owa-service/lib/contract/ConsentStateType';
import registerConsentOperation from 'owa-service/lib/operation/registerConsentOperation';
import registerConsentRequest from 'owa-service/lib/factory/registerConsentRequest';
import type RegisterConsentJsonResponse from 'owa-service/lib/contract/RegisterConsentJsonResponse';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export default function registerConsent(
    id: string,
    consentState: ConsentStateType
): Promise<RegisterConsentJsonResponse> {
    const request = registerConsentRequest({ Id: id, ConsentState: consentState });

    return registerConsentOperation({ Header: getJsonRequestHeader(), Body: request });
}
