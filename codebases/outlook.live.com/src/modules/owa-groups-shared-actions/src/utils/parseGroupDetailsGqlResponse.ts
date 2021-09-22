import type * as Schema from 'owa-graph-schema';
import type UnifiedGroupDetails from 'owa-service/lib/contract/UnifiedGroupDetails';
import type UserUnifiedGroupRelationship from 'owa-service/lib/contract/UserUnifiedGroupRelationship';
import MailboxAssociationSubscriptionType from 'owa-service/lib/contract/UnifiedGroupSubscriptionType';
import type UnifiedGroupMailboxSettings from 'owa-service/lib/contract/UnifiedGroupMailboxSettings';
import type UnifiedGroupDetailsAdditionalProperties from 'owa-service/lib/contract/UnifiedGroupDetailsAdditionalProperties';
import type GroupPropertySet from 'owa-service/lib/contract/GroupPropertySet';
import parseRetentionPolicyTags from './parseRetentionPolicyTags';
import { mapGqlAccessTypeToStore } from 'owa-group-common';

function getUserGroupRelationship(gqlGroup: Schema.Group): UserUnifiedGroupRelationship {
    let subscriptionType = undefined;
    switch (gqlGroup.Details?.SubscriptionType) {
        case 'None':
            subscriptionType = MailboxAssociationSubscriptionType.None;
            break;
        case 'ReplyOnly':
            subscriptionType = MailboxAssociationSubscriptionType.Message;
            break;
        case 'ReplyAndCalendar':
            subscriptionType = MailboxAssociationSubscriptionType.Calendar;
            break;
        case 'All':
            subscriptionType = MailboxAssociationSubscriptionType.All;
            break;
    }
    return {
        IsMember: gqlGroup.Details?.IsMember,
        IsOwner: gqlGroup.Details?.IsOwner,
        IsSubscribed: gqlGroup.Details?.IsSubscribedByMail,
        SubscriptionType: subscriptionType,
    } as UserUnifiedGroupRelationship;
}

function getMailboxSettings(gqlGroup: Schema.Group): UnifiedGroupMailboxSettings {
    return {
        ExternalSendersEnabled: gqlGroup.Details?.AllowExternalSenders,
        AutoSubscribeNewMembers: gqlGroup.Details?.AutoSubscribeNewMembers,
        MailboxCultureName: gqlGroup.Details?.Culture,
        RetentionPolicyTags: parseRetentionPolicyTags(gqlGroup.Details?.RetentionPolicyTags),
    } as UnifiedGroupMailboxSettings;
}

function getAdditionalProperties(gqlGroup: Schema.Group): UnifiedGroupDetailsAdditionalProperties {
    return {
        ExternalMemberCount: gqlGroup.Details?.HasGuests ? 1 : 0,
        IsMembershipDynamic: gqlGroup.Details?.IsMembershipDynamic,
        IsGroupMembershipHidden: gqlGroup.Details?.IsMembershipHidden,
        IsJoinRequestPendingApproval: gqlGroup.Details?.IsJoinRequestPendingApproval,
        SendAsPermission: gqlGroup.Details?.SendAsPermission,
    } as UnifiedGroupDetailsAdditionalProperties;
}

function getEditProperties(gqlGroup: Schema.Group): GroupPropertySet {
    return {
        SubscriptionType: {
            AllowedValues: gqlGroup.Details?.SubscriptionTypeAllowedValues?.map(
                gqlSubscriptionType => {
                    switch (gqlSubscriptionType) {
                        case 'ReplyOnly':
                            return 'Message';
                        case 'ReplyAndCalendar':
                            return 'Calendar';
                        default:
                            return gqlSubscriptionType;
                    }
                }
            ),
        },
    } as GroupPropertySet;
}

export default function parseGroupDetailsGqlResponse(
    gqlGroupDetailsResponse: Schema.Group
): UnifiedGroupDetails {
    return {
        SmtpAddress: gqlGroupDetailsResponse.SmtpAddress,
        DisplayName: gqlGroupDetailsResponse.Name,
        AccessType: mapGqlAccessTypeToStore(gqlGroupDetailsResponse.AccessType),
        ProxyAddresses: gqlGroupDetailsResponse.Details?.ProxyAddresses,
        ExternalDirectoryOrganizationId: gqlGroupDetailsResponse.TenantId,
        Kind: gqlGroupDetailsResponse.Kind,
        UserGroupRelationship: getUserGroupRelationship(gqlGroupDetailsResponse),
        GroupResources: gqlGroupDetailsResponse.Details?.Resources,
        MailboxSettings: getMailboxSettings(gqlGroupDetailsResponse),
        OwnerCount: gqlGroupDetailsResponse.Details?.OwnerCount,
        Description: gqlGroupDetailsResponse.Details?.Description,
        ExternalDirectoryObjectId: gqlGroupDetailsResponse.GroupId,
        AdditionalProperties: getAdditionalProperties(gqlGroupDetailsResponse),
        Classification: gqlGroupDetailsResponse.Details?.Classification,
        MemberCount: gqlGroupDetailsResponse.Details?.MemberCount,
        EditProperties: getEditProperties(gqlGroupDetailsResponse),
    } as UnifiedGroupDetails;
}
