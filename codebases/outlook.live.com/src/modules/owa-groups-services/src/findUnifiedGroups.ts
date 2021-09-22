import type FindUnifiedGroupsJsonResponse from 'owa-service/lib/contract/FindUnifiedGroupsJsonResponse';
import findUnifiedGroupsRequest from 'owa-service/lib/factory/findUnifiedGroupsRequest';
import findUnifiedGroupsOperation from 'owa-service/lib/operation/findUnifiedGroupsOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export function findUnifiedGroups(
    filterText?: string,
    groupsToLoad?: number
): Promise<FindUnifiedGroupsJsonResponse> {
    return findUnifiedGroupsOperation({
        Header: getJsonRequestHeader(),
        Body: findUnifiedGroupsRequest({
            IncludeInactiveGroups: true,
            PageNumber: 1,
            QueryString: filterText,
            PageSize: groupsToLoad ? groupsToLoad : 100,
            ApplicationId: 'Owa',
        }),
    });
}
