import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type GetSuggestedUnifiedGroupsJsonResponse from 'owa-service/lib/contract/GetSuggestedUnifiedGroupsJsonResponse';
import getSuggestedUnifiedGroupsRequest from 'owa-service/lib/factory/getSuggestedUnifiedGroupsRequest';
import getSuggestedUnifiedGroupsOperation from 'owa-service/lib/operation/getSuggestedUnifiedGroupsOperation';

export function getSuggestedUnifiedGroups(
    groupsToLoad?: number
): Promise<GetSuggestedUnifiedGroupsJsonResponse> {
    const groupCountLimit = 50;
    // We don't care anymore about relevant people returned by GSUG, so we must pass MinimumTopRelevantMemberCountLimit
    const topRelevantMemberCount = 1;

    return getSuggestedUnifiedGroupsOperation({
        Header: getJsonRequestHeader(),
        Body: getSuggestedUnifiedGroupsRequest({
            GroupCountLimit: groupsToLoad ? groupsToLoad : groupCountLimit,
            TopRelevantMemberCountLimit: topRelevantMemberCount,
        }),
    });
}
