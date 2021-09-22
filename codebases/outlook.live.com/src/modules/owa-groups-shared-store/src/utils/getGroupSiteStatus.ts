import { getGroupSiteStatusStore } from '../GroupSiteStatusStore';
import GroupSiteStatus from 'owa-groups-sharepoint-commands/lib/schema/GroupSiteStatus';

export function getGroupSiteStatus(groupSmtpAddress: string): GroupSiteStatus {
    groupSmtpAddress = groupSmtpAddress.toLocaleLowerCase();
    if (getGroupSiteStatusStore().groupSiteStatus.has(groupSmtpAddress)) {
        return getGroupSiteStatusStore().groupSiteStatus.get(groupSmtpAddress);
    }

    return GroupSiteStatus.NotFound;
}
