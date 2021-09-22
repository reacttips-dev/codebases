import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type UnifiedGroupIdentity from 'owa-service/lib/contract/UnifiedGroupIdentity';
import UnifiedGroupIdentityType from 'owa-service/lib/contract/UnifiedGroupIdentityType';
import dismissUserUnifiedGroupSuggestionRequest from 'owa-service/lib/factory/dismissUserUnifiedGroupSuggestionRequest';
import dismissUserUnifiedGroupSuggestionOperation from 'owa-service/lib/operation/dismissUserUnifiedGroupSuggestionOperation';
import type { DismissUserUnifiedGroupSuggestionResult } from 'owa-groups-types';

export function dismissUserUnifiedGroupSuggestion(
    groupSmtpAddress?: string
): Promise<DismissUserUnifiedGroupSuggestionResult> {
    const group: UnifiedGroupIdentity = {
        Type: UnifiedGroupIdentityType.SmtpAddress,
        Value: groupSmtpAddress,
    };

    return new Promise(function (resolve: any, reject: any) {
        dismissUserUnifiedGroupSuggestionOperation({
            Header: getJsonRequestHeader(),
            Body: dismissUserUnifiedGroupSuggestionRequest({
                GroupIdentity: group,
            }),
        })
            .then(response =>
                resolve({
                    response: response,
                    groupId: groupSmtpAddress,
                })
            )
            .catch(() => {
                reject();
            });
    });
}
