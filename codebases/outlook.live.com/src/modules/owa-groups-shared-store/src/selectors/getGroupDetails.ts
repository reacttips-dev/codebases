import { getGroupsStore } from '../GroupsStore';
import type UnifiedGroupDetails from 'owa-service/lib/contract/UnifiedGroupDetails';

export default function getGroupDetails(groupSmtpAddress: string): UnifiedGroupDetails {
    const groupStore = getGroupsStore();
    const group = groupStore.groups.get(groupSmtpAddress.toLowerCase());
    return group ? group.groupDetails : null;
}
