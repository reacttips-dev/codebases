import { mutatorAction } from 'satcheljs';
import { getGroupSiteStatusStore } from '../GroupSiteStatusStore';
import type GroupSiteStatus from 'owa-groups-sharepoint-commands/lib/schema/GroupSiteStatus';

export const setGroupSiteStatus = mutatorAction(
    'setGroupSiteStatus',
    function setGroupSiteStatus(groupSmtpAddress: string, groupSiteStatus: GroupSiteStatus) {
        groupSmtpAddress = groupSmtpAddress.toLocaleLowerCase();
        if (
            getGroupSiteStatusStore().groupSiteStatus.has(groupSmtpAddress) &&
            groupSiteStatus == getGroupSiteStatusStore().groupSiteStatus.get(groupSmtpAddress)
        ) {
            return;
        }

        getGroupSiteStatusStore().groupSiteStatus.set(groupSmtpAddress, groupSiteStatus);
    }
);

export default setGroupSiteStatus;
