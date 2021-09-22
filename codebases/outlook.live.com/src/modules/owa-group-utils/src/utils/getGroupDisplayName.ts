import { getGroupsStore } from 'owa-groups-shared-store/lib/GroupsStore';

export function getGroupDisplayName(groupId: string): string {
    if (!groupId) {
        return null;
    }

    const groupsStore = getGroupsStore();
    const group = groupsStore.groups.get(groupId.toLowerCase());
    return group?.basicInformation ? group.basicInformation.DisplayName : groupId;
}
