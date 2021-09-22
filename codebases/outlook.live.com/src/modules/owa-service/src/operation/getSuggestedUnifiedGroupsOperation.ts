import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetSuggestedUnifiedGroupsJsonRequest from '../contract/GetSuggestedUnifiedGroupsJsonRequest';
import type GetSuggestedUnifiedGroupsJsonResponse from '../contract/GetSuggestedUnifiedGroupsJsonResponse';
import getSuggestedUnifiedGroupsJsonRequest from '../factory/getSuggestedUnifiedGroupsJsonRequest';

export default function getSuggestedUnifiedGroupsOperation(
    req: GetSuggestedUnifiedGroupsJsonRequest,
    options?: RequestOptions
): Promise<GetSuggestedUnifiedGroupsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getSuggestedUnifiedGroupsJsonRequest(req);
    }

    return makeServiceRequest<GetSuggestedUnifiedGroupsJsonResponse>(
        'GetSuggestedUnifiedGroups',
        req,
        options
    );
}
