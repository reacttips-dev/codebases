import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type UnifiedGroupIdentity from 'owa-service/lib/contract/UnifiedGroupIdentity';
import UnifiedGroupMembershipActionType from 'owa-service/lib/contract/UnifiedGroupMembershipActionType';
import UnifiedGroupIdentityType from 'owa-service/lib/contract/UnifiedGroupIdentityType';
import unifiedGroupIdentity from 'owa-service/lib/factory/unifiedGroupIdentity';
import setUnifiedGroupMembershipStateRequest from 'owa-service/lib/factory/setUnifiedGroupMembershipStateRequest';
import setUnifiedGroupMembershipStateOperation from 'owa-service/lib/operation/setUnifiedGroupMembershipStateOperation';
import { getUserSmtp } from 'owa-groups-adaptors';
import { getHeaders } from 'owa-headers';
import type { SetUnifiedGroupMembershipStateResult } from 'owa-groups-types';

export function setUnifiedGroupMembershipState(
    members: string[],
    groupSmtpAddress: string,
    action: UnifiedGroupMembershipActionType,
    rwcToken?: string
): Promise<SetUnifiedGroupMembershipStateResult> {
    const group: UnifiedGroupIdentity = unifiedGroupIdentity({
        Type: UnifiedGroupIdentityType.SmtpAddress,
        Value: groupSmtpAddress,
    });

    let options = null;
    const userSmtp: string = getUserSmtp();
    const isSelfOperation =
        userSmtp && members.some(memberSmtp => memberSmtp.toLowerCase() == userSmtp.toLowerCase());

    // Do not set group x-anchormailbox in self operation scenarios.
    // Always do set it for Leave scenario (required by consumer groups)
    if (!isSelfOperation || action == UnifiedGroupMembershipActionType.Remove) {
        options = { headers: getHeaders(groupSmtpAddress) };
    }

    if (rwcToken && rwcToken.length > 0) {
        options.headers.set('ReadWriteConsistencyToken', rwcToken);
    }

    return new Promise(function (
        resolve: (
            value?:
                | SetUnifiedGroupMembershipStateResult
                | PromiseLike<SetUnifiedGroupMembershipStateResult>
        ) => void,
        reject: (error?: any) => void
    ) {
        setUnifiedGroupMembershipStateOperation(
            {
                Header: getJsonRequestHeader(),
                Body: setUnifiedGroupMembershipStateRequest({
                    Members: members,
                    Action: action,
                    GroupIdentity: group,
                }),
            },
            options
        )
            .then(response =>
                resolve({
                    response: response,
                    groupId: groupSmtpAddress,
                })
            )
            .catch(error => {
                reject(error);
            });
    });
}
