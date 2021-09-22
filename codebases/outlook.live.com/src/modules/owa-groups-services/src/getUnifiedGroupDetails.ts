import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import UnifiedGroupDetailsResponseShape from 'owa-service/lib/contract/UnifiedGroupDetailsResponseShape';
import type GetUnifiedGroupDetailsJsonResponse from 'owa-service/lib/contract/GetUnifiedGroupDetailsJsonResponse';
import UnifiedGroupIdentityType from 'owa-service/lib/contract/UnifiedGroupIdentityType';
import UnifiedGroupDetailsAdditionalPropertyType from 'owa-service/lib/contract/UnifiedGroupDetailsAdditionalPropertyType';
import getUnifiedGroupDetailsRequest from 'owa-service/lib/factory/getUnifiedGroupDetailsRequest';
import getUnifiedGroupDetailsOperation from 'owa-service/lib/operation/getUnifiedGroupDetailsOperation';
import { getOwaCanaryCookie } from 'owa-service/lib/canary';
import type UnifiedGroupIdentity from 'owa-service/lib/contract/UnifiedGroupIdentity';
import { isSuccess } from './index';
import isSendAsAliasEnabled from 'owa-proxy-address-option/lib/utils/isSendAsAliasEnabled';
import { isFeatureEnabled } from 'owa-feature-flags';

export function getUnifiedGroupDetails(
    groupSmtpAddress: string,
    loadFullDetails?: boolean
): Promise<GetUnifiedGroupDetailsJsonResponse> {
    return getUnifiedGroupDetailsBasedonGroupIdentity(
        {
            Value: groupSmtpAddress,
            Type: UnifiedGroupIdentityType.SmtpAddress,
        },
        loadFullDetails
            ? UnifiedGroupDetailsResponseShape.Full
            : UnifiedGroupDetailsResponseShape.Basic
    );
}

export function getUnifiedGroupDetailsBasedonGroupIdentity(
    groupIdentity: UnifiedGroupIdentity,
    responseShape: UnifiedGroupDetailsResponseShape,
    prefixedId?: string
): Promise<GetUnifiedGroupDetailsJsonResponse> {
    const additionalProperties = [
        UnifiedGroupDetailsAdditionalPropertyType.ExternalMemberCount,
        UnifiedGroupDetailsAdditionalPropertyType.IsGroupMembershipHidden,
        UnifiedGroupDetailsAdditionalPropertyType.IsMembershipDynamic,
        UnifiedGroupDetailsAdditionalPropertyType.IsJoinRequestPendingApproval,
    ];

    if (isSendAsAliasEnabled() || isFeatureEnabled('grp-SendAsOnBehalfOfGrp')) {
        additionalProperties.push(UnifiedGroupDetailsAdditionalPropertyType.IsSendAsEnabled);
    }

    return getUnifiedGroupDetailsOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getUnifiedGroupDetailsRequest({
                GroupIdentity: groupIdentity,
                ResponseShape: responseShape,
                IncludeCapabilities: true,
                AdditionalProperties: additionalProperties,
            }),
        },
        {
            headers: <any>{
                'X-OWA-ExplicitLogonUser': groupIdentity.Value,
                'X-AnchorMailbox':
                    prefixedId && prefixedId.trim().length > 0 ? prefixedId : groupIdentity.Value,
                'X-OWA-CANARY': getOwaCanaryCookie(),
            },
            datapoint: {
                jsonCustomData: (json: GetUnifiedGroupDetailsJsonResponse) => {
                    let customData: { [index: string]: number | string | boolean | Date } = {};
                    if (!json || !json.Body || !isSuccess(json.Body)) {
                        customData.error = 'NoBody';
                    } else if (!json.Body.GroupDetails) {
                        customData.error = 'NOGroupDetails';
                    }
                    return customData;
                },
            },
        }
    );
}
