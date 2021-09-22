import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type DismissUserUnifiedGroupSuggestionJsonRequest from '../contract/DismissUserUnifiedGroupSuggestionJsonRequest';
import type DismissUserUnifiedGroupSuggestionJsonResponse from '../contract/DismissUserUnifiedGroupSuggestionJsonResponse';
import dismissUserUnifiedGroupSuggestionJsonRequest from '../factory/dismissUserUnifiedGroupSuggestionJsonRequest';

export default function dismissUserUnifiedGroupSuggestionOperation(
    req: DismissUserUnifiedGroupSuggestionJsonRequest,
    options?: RequestOptions
): Promise<DismissUserUnifiedGroupSuggestionJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = dismissUserUnifiedGroupSuggestionJsonRequest(req);
    }

    return makeServiceRequest<DismissUserUnifiedGroupSuggestionJsonResponse>(
        'DismissUserUnifiedGroupSuggestion',
        req,
        options
    );
}
