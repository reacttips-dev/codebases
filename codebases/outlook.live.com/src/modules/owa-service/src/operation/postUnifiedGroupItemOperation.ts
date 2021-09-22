import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type PostUnifiedGroupItemJsonRequest from '../contract/PostUnifiedGroupItemJsonRequest';
import type PostUnifiedGroupItemJsonResponse from '../contract/PostUnifiedGroupItemJsonResponse';
import postUnifiedGroupItemJsonRequest from '../factory/postUnifiedGroupItemJsonRequest';

export default function postUnifiedGroupItemOperation(
    req: PostUnifiedGroupItemJsonRequest,
    options?: RequestOptions
): Promise<PostUnifiedGroupItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = postUnifiedGroupItemJsonRequest(req);
    }

    return makeServiceRequest<PostUnifiedGroupItemJsonResponse>(
        'PostUnifiedGroupItem',
        req,
        options
    );
}
