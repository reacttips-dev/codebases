import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type RegisterConsentJsonRequest from '../contract/RegisterConsentJsonRequest';
import type RegisterConsentJsonResponse from '../contract/RegisterConsentJsonResponse';
import registerConsentJsonRequest from '../factory/registerConsentJsonRequest';

export default function registerConsentOperation(
    req: RegisterConsentJsonRequest,
    options?: RequestOptions
): Promise<RegisterConsentJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = registerConsentJsonRequest(req);
    }

    return makeServiceRequest<RegisterConsentJsonResponse>('RegisterConsent', req, options);
}
