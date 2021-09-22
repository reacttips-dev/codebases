import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type IdentityRequest from '../contract/IdentityRequest';
import type GetMailboxResponse from '../contract/GetMailboxResponse';
import identityRequest from '../factory/identityRequest';

export default function getMailboxByIdentityOperation(
    req: IdentityRequest,
    options?: RequestOptions
): Promise<GetMailboxResponse> {
    if (req !== undefined && !req['__type']) {
        req = identityRequest(req);
    }

    return makeServiceRequest<GetMailboxResponse>('GetMailboxByIdentity', req, options);
}
