import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type PostGroupItemJsonRequest from '../contract/PostGroupItemJsonRequest';
import type PostModernGroupItemJsonResponse from '../contract/PostModernGroupItemJsonResponse';
import postGroupItemJsonRequest from '../factory/postGroupItemJsonRequest';

export default function postGroupItemOperation(
    req: PostGroupItemJsonRequest,
    options?: RequestOptions
): Promise<PostModernGroupItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = postGroupItemJsonRequest(req);
    }

    return makeServiceRequest<PostModernGroupItemJsonResponse>('PostGroupItem', req, options);
}
