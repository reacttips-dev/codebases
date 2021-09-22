import GroupSiteStatus from 'owa-groups-sharepoint-commands/lib/schema/GroupSiteStatus';
import type UnifiedGroupDetails from 'owa-service/lib/contract/UnifiedGroupDetails';
import setGroupSiteStatus from './setGroupSiteStatus';
import { getGroupResourceUrl } from '../selectors/getGroupResourceUrl';

function isUrlProvisioned(groupSiteUrl: string): boolean {
    return groupSiteUrl.indexOf('_layouts/groupstatus.aspx') == -1;
}

const addGroupSiteStatus = function addGroupSiteStatus(
    groupSmtpAddress: string,
    groupDetails: UnifiedGroupDetails
) {
    const groupSiteUrl = getGroupResourceUrl(groupDetails, 'Site');

    if (!groupSiteUrl) {
        setGroupSiteStatus(groupSmtpAddress, GroupSiteStatus.NotFound);
    } else if (isUrlProvisioned(groupSiteUrl)) {
        setGroupSiteStatus(groupSmtpAddress, GroupSiteStatus.Ready);
    } else {
        setGroupSiteStatus(groupSmtpAddress, GroupSiteStatus.Provisioning);
    }
};

export default addGroupSiteStatus;
