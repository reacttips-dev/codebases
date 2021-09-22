import { getGroupsStore } from '../GroupsStore';

export default function isGroupDetailsValid(groupSmtpAddress: string): boolean {
    const groupStore = getGroupsStore();
    const group = groupStore.groups.get(groupSmtpAddress.toLowerCase());
    if (group) {
        return !group.groupDetailsError;
    } else {
        return false;
    }
}
