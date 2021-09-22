import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type FindConversationJsonRequest from '../contract/FindConversationJsonRequest';
import type FindConversationJsonResponse from '../contract/FindConversationJsonResponse';
import findConversationJsonRequest from '../factory/findConversationJsonRequest';

export default function findConversationOperation(
    req: FindConversationJsonRequest,
    options?: RequestOptions
): Promise<FindConversationJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = findConversationJsonRequest(req);
    }

    return makeServiceRequest<FindConversationJsonResponse>('FindConversation', req, options);
}
