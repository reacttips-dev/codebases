import { isFeatureEnabled } from 'owa-feature-flags';
import getGroupDetails from 'owa-groups-shared-store/lib/selectors/getGroupDetails';

export default function isSendAsPermissionEnabled(groupId: string): boolean {
    if (!isFeatureEnabled('grp-SendAsOnBehalfOfGrp')) {
        return false;
    }

    const groupDetails = groupId ? getGroupDetails(groupId) : null;
    const sendAsEnabled = groupDetails?.AdditionalProperties?.SendAsPermission;
    return !!sendAsEnabled;
}
