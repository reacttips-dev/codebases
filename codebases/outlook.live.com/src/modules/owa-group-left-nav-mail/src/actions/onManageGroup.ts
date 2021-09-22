import { getGroupsHubPath } from 'owa-url';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import { logUsage } from 'owa-analytics';
import { getGroupsStore } from 'owa-groups-shared-store/lib/GroupsStore';
import { getLeftNavGroupsStore } from 'owa-group-left-nav/lib/store/store';

export function onManageGroups() {
    const leftNavGroupsStore = getLeftNavGroupsStore();
    const groups = getGroupsStore().groups;
    let currentGroup;
    const redirectToOwnedGroups =
        leftNavGroupsStore.myOrgGroups.some(groupId => {
            currentGroup = groups.get(groupId);
            return currentGroup.groupDetails?.UserGroupRelationship
                ? currentGroup.groupDetails.UserGroupRelationship.IsOwner
                : currentGroup.basicInformation?.AdditionalProperties?.IsOwner;
        }) || leftNavGroupsStore.myOrgGroups.length === 0;
    logUsage('ManageGroupClicked');
    const queryParam = getHostLocation().search;
    let action = getGroupsHubPath(redirectToOwnedGroups) + queryParam;
    const sourceParam = 'source=ManageGroups';
    action += (queryParam ? '&' : '?') + sourceParam;
    window.open(action.toString(), '_blank');
}
