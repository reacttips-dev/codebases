import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type UnifiedGroupIdentity from 'owa-service/lib/contract/UnifiedGroupIdentity';
import unifiedGroupIdentity from 'owa-service/lib/factory/unifiedGroupIdentity';
import UnifiedGroupIdentityType from 'owa-service/lib/contract/UnifiedGroupIdentityType';
import bodyContentType from 'owa-service/lib/factory/bodyContentType';
import type BodyType from 'owa-service/lib/contract/BodyType';
import joinPrivateUnifiedGroupRequest from 'owa-service/lib/factory/joinPrivateUnifiedGroupRequest';
import joinPrivateUnifiedGroupOperation from 'owa-service/lib/operation/joinPrivateUnifiedGroupOperation';
import { getHeaders } from 'owa-headers';
import type { JoinPrivateUnifiedGroupResult } from 'owa-groups-types';

function getJoinRequestBody(group: UnifiedGroupIdentity, message?: string) {
    let joinRequestBody = joinPrivateUnifiedGroupRequest({
        GroupIdentity: group,
    });

    // do not add message if it's just whitespace
    if (message && message.trim() != '') {
        joinRequestBody.MessageBody = bodyContentType({
            BodyType: 'Text' as BodyType,
            Value: message,
        });
    }

    return joinRequestBody;
}

export function joinPrivateUnifiedGroup(
    groupSmtpAddress: string,
    message?: string
): Promise<JoinPrivateUnifiedGroupResult> {
    const group: UnifiedGroupIdentity = unifiedGroupIdentity({
        Type: UnifiedGroupIdentityType.SmtpAddress,
        Value: groupSmtpAddress,
    });

    let options = { headers: getHeaders(groupSmtpAddress) };

    return new Promise(function (
        resolve: (
            value?: JoinPrivateUnifiedGroupResult | PromiseLike<JoinPrivateUnifiedGroupResult>
        ) => void,
        reject: (error?: any) => void
    ) {
        joinPrivateUnifiedGroupOperation(
            {
                Header: getJsonRequestHeader(),
                Body: getJoinRequestBody(group, message),
            },
            options
        )
            .then(response =>
                resolve({
                    response: response,
                    groupId: groupSmtpAddress,
                })
            )
            .catch(exception => {
                reject(exception);
            });
    });
}
