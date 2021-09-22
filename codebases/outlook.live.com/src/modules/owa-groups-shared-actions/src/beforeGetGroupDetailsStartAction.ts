import { setGroupSiteStatus, getGroupSiteStatus } from 'owa-groups-shared-store';
import GroupSiteStatus from 'owa-groups-sharepoint-commands/lib/schema/GroupSiteStatus';
import { action, orchestrator } from 'satcheljs';

const beforeGetGroupDetailsStartAction = action(
    'beforeGetGroupDetailsStartAction',
    (groupSmtpAddress: string) => {
        return { groupSmtpAddress };
    }
);

orchestrator(beforeGetGroupDetailsStartAction, msg => {
    const currentStatus = getGroupSiteStatus(msg.groupSmtpAddress);
    if (currentStatus == GroupSiteStatus.Error) {
        // If the site status of a group is error, user switch to another group then go back
        // we reset the status to be provisioning to prevent showing error message, then wait
        // for the response for getGroupDetails and polling SPO.
        setGroupSiteStatus(msg.groupSmtpAddress, GroupSiteStatus.Provisioning);
    }
});

export default beforeGetGroupDetailsStartAction;
