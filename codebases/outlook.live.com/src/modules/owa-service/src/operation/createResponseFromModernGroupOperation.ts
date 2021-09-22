import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type CreateResponseFromModernGroupJsonRequest from '../contract/CreateResponseFromModernGroupJsonRequest';
import type CreateResponseFromModernGroupJsonResponse from '../contract/CreateResponseFromModernGroupJsonResponse';
import createResponseFromModernGroupJsonRequest from '../factory/createResponseFromModernGroupJsonRequest';

export default function createResponseFromModernGroupOperation(
    req: CreateResponseFromModernGroupJsonRequest,
    options?: RequestOptions
): Promise<CreateResponseFromModernGroupJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = createResponseFromModernGroupJsonRequest(req);
    }

    return makeServiceRequest<CreateResponseFromModernGroupJsonResponse>(
        'CreateResponseFromModernGroup',
        req,
        options
    );
}
