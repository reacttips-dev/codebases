import UnifiedGroupSubscriptionType from 'owa-service/lib/contract/UnifiedGroupSubscriptionType';
import type { GroupInformation } from '../index';
import type { GroupsState } from '../schema/GroupsState';

/* The server will return certain group detail properties as empty in the case that they are
false. This can lead to problems in React/Mobx, as mobx only tracks properties that are
initialized in the store with a value (that value can be null). To be sure that our React
components adjust to updates to these values, we initialize certain properties with their
default values here if they are empty. We also initialize the group's basic information if
the groupDetails are returned before the basic info */
export default function initializeGroupDefaults(
    state: GroupsState,
    groupSmtp: string,
    groupInformation: GroupInformation
): GroupInformation {
    const group = state.groups.get(groupSmtp.toLowerCase());

    // initialize unreadMessageCount and groupDetails error so they're tracked
    if (!group) {
        groupInformation.unreadMessageCount = null;
        groupInformation.groupDetailsError = groupInformation.groupDetailsError || false;
    }

    // On an error, set the display name and smtp of the group if we have no prior
    // information about the group or the group's basic information
    if (groupInformation.groupDetailsError && (!group || !group.basicInformation)) {
        groupInformation.basicInformation = {
            SmtpAddress: groupSmtp,
            DisplayName: groupSmtp,
        };
    }

    if (groupInformation.groupDetails) {
        const groupDetails = groupInformation.groupDetails;

        // If we don't have basic info or we previously had a groupDetails error
        // use groupDetails to populate the basic information
        if (!group || !group.basicInformation || group.groupDetailsError) {
            groupInformation.basicInformation = {
                SmtpAddress: groupDetails.SmtpAddress,
                DisplayName: groupDetails.DisplayName,
                AccessType: groupDetails.AccessType,
                LegacyDN: groupDetails.LegacyDN,
                MailboxGuid: groupDetails.MailboxGuid,
            };
        }

        // Initialize defaults for user group relationship properties so they're tracked
        groupInformation.groupDetails.UserGroupRelationship = {
            SubscriptionType:
                groupDetails.UserGroupRelationship?.SubscriptionType ||
                UnifiedGroupSubscriptionType.None,
            IsSubscribed: groupDetails.UserGroupRelationship?.IsSubscribed || false,
            ShouldIgnoreReply: groupDetails.UserGroupRelationship?.ShouldIgnoreReply || false,
            IsMember: groupDetails.UserGroupRelationship?.IsMember || false,
            IsOwner: groupDetails.UserGroupRelationship?.IsOwner || false,
        };
    }

    return groupInformation;
}
