import { mutatorAction } from 'satcheljs';
import getGroupDetails from '../selectors/getGroupDetails';
import GroupSiteStatus from 'owa-groups-sharepoint-commands/lib/schema/GroupSiteStatus';
import { getGroupResource } from '../selectors/getGroupResourceUrl';

export const updateGroupSiteAndDocumentUrl = mutatorAction(
    'updateGroupSiteAndDocumentUrl',
    function updateGroupSiteInfo(
        groupSmtpAddress: string,
        siteStatus: GroupSiteStatus,
        siteUrl?: string,
        documentsUrl?: string
    ) {
        if (siteStatus == GroupSiteStatus.Ready) {
            const groupDetails = getGroupDetails(groupSmtpAddress);

            getGroupResource(groupDetails, 'Site')[0].Url = siteUrl;
            getGroupResource(groupDetails, 'Files')[0].Url = documentsUrl;
        }
    }
);

export default updateGroupSiteAndDocumentUrl;
