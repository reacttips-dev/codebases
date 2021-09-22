import { getOwaCanaryCookie } from 'owa-service/lib/canary';
import UnifiedGroupIdentityType from 'owa-service/lib/contract/UnifiedGroupIdentityType';
import getUnifiedGroupMembersRequest from 'owa-service/lib/factory/getUnifiedGroupMembersRequest';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import getUnifiedGroupMembersOperation from 'owa-service/lib/operation/getUnifiedGroupMembersOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { getPeopleIKnowGraphData } from './getPeopleIKnowCommand';
import type { GetUnifiedGroupMembersResult } from 'owa-groups-types';
import { isSuccess } from './index';

export async function getUnifiedGroupMembers(
    groupSmtpAddress: string,
    maxMembersToReturn?: number
): Promise<GetUnifiedGroupMembersResult> {
    let membersPaging;
    if (maxMembersToReturn) {
        membersPaging = indexedPageView({
            Offset: 0,
            BasePoint: 'Beginning',
            MaxEntriesReturned: maxMembersToReturn,
        });
    }

    const peopleIKnowGraphData = await getPeopleIKnowGraphData();

    return getUnifiedGroupMembersOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getUnifiedGroupMembersRequest({
                GroupIdentity: {
                    Value: groupSmtpAddress,
                    Type: UnifiedGroupIdentityType.SmtpAddress,
                },
                MembersPaging: membersPaging,
                SerializedPeopleIKnowGraph: peopleIKnowGraphData,
            }),
        },
        {
            headers: <any>{
                'X-OWA-ExplicitLogonUser': groupSmtpAddress,
                'X-AnchorMailbox': groupSmtpAddress,
                'X-OWA-CANARY': getOwaCanaryCookie(),
            },
            datapoint: {
                jsonCustomData: (json: GetUnifiedGroupMembersResult) => {
                    let customData: { [index: string]: number | string | boolean | Date } = {};
                    if (
                        !json ||
                        !json.response ||
                        !json.response.Body ||
                        !isSuccess(json.response.Body)
                    ) {
                        customData.error = 'NoBody';
                    } else if (!json.response.Body.MembersInfo) {
                        customData.error = 'NOGroupDetails';
                    }
                    return customData;
                },
            },
        }
    ).then(response => ({
        response: response,
        groupId: groupSmtpAddress,
    }));
}
