import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type UnifiedGroupIdentity from 'owa-service/lib/contract/UnifiedGroupIdentity';
import UnifiedGroupIdentityType from 'owa-service/lib/contract/UnifiedGroupIdentityType';
import unifiedGroupIdentity from 'owa-service/lib/factory/unifiedGroupIdentity';
import setUnifiedGroupUserSubscribeStateRequest from 'owa-service/lib/factory/setUnifiedGroupUserSubscribeStateRequest';
import setUnifiedGroupUserSubscribeStateOperation from 'owa-service/lib/operation/setUnifiedGroupUserSubscribeStateOperation';
import { getHeaders } from 'owa-headers';
import type {
    GroupSubscriptionProperties,
    GroupSubscriptionType,
} from 'owa-groups-shared-store/lib/schema/GroupSubscriptionType';
import { mapSubscriptionTypeToProperties } from 'owa-groups-shared-store/lib/utils/subscriptionTypeMapping';
import type { SetUnifiedGroupUserSubscribeStateResult } from 'owa-groups-types';

export function setUnifiedGroupUserSubscribeState(
    groupSmtpAddress: string,
    subscriptionType: GroupSubscriptionType
): Promise<SetUnifiedGroupUserSubscribeStateResult> {
    const group: UnifiedGroupIdentity = unifiedGroupIdentity({
        Type: UnifiedGroupIdentityType.SmtpAddress,
        Value: groupSmtpAddress,
    });
    const groupSubscriptionProperties: GroupSubscriptionProperties = mapSubscriptionTypeToProperties(
        subscriptionType
    );

    return new Promise(function (
        resolve: (
            value?:
                | SetUnifiedGroupUserSubscribeStateResult
                | PromiseLike<SetUnifiedGroupUserSubscribeStateResult>
        ) => void,
        reject: (error?: any) => void
    ) {
        setUnifiedGroupUserSubscribeStateOperation(
            {
                Header: getJsonRequestHeader(),
                Body: setUnifiedGroupUserSubscribeStateRequest({
                    GroupIdentity: group,
                    SubscriptionType: groupSubscriptionProperties.SubscriptionType,
                    ShouldIgnoreReply: groupSubscriptionProperties.ShouldIgnoreReply,
                    /* Can only set either subscription type OR isSubscribed */
                }),
            },
            { headers: getHeaders(groupSmtpAddress) }
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
