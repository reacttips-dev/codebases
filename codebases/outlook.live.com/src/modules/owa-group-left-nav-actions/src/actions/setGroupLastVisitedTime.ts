import setUnifiedGroupLastVisitedTimeOperation from 'owa-service/lib/operation/setUnifiedGroupLastVisitedTimeOperation';
import setUnifiedGroupLastVisitedTimeJsonRequest from 'owa-service/lib/factory/setUnifiedGroupLastVisitedTimeJsonRequest';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import setUnifiedGroupLastVisitedTimeRequest from 'owa-service/lib/factory/setUnifiedGroupLastVisitedTimeRequest';
import type UnifiedGroupIdentity from 'owa-service/lib/contract/UnifiedGroupIdentity';
import UnifiedGroupIdentityType from 'owa-service/lib/contract/UnifiedGroupIdentityType';
import unifiedGroupIdentity from 'owa-service/lib/factory/unifiedGroupIdentity';

export default function setGroupLastVisitedTime(groupSmtpAddress: string) {
    const groupIdentity: UnifiedGroupIdentity = unifiedGroupIdentity({
        Type: UnifiedGroupIdentityType.SmtpAddress,
        Value: groupSmtpAddress,
    });

    setUnifiedGroupLastVisitedTimeOperation(
        setUnifiedGroupLastVisitedTimeJsonRequest({
            Header: getJsonRequestHeader(),
            Body: setUnifiedGroupLastVisitedTimeRequest({
                GroupIdentity: groupIdentity,
                LastVisitedTimeUtc: new Date().toISOString(),
                PreserveReadState: true,
            }),
        })
    );
}
