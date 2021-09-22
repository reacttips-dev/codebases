import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetConversationItemsJsonRequest from '../contract/GetConversationItemsJsonRequest';
import type GetConversationItemsJsonResponse from '../contract/GetConversationItemsJsonResponse';
import getConversationItemsJsonRequest from '../factory/getConversationItemsJsonRequest';

export default function getConversationItemsOperation(
    req: GetConversationItemsJsonRequest,
    options?: RequestOptions
): Promise<GetConversationItemsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getConversationItemsJsonRequest(req);
    }

    return makeServiceRequest<GetConversationItemsJsonResponse>(
        'GetConversationItems',
        req,
        options
    );
}
