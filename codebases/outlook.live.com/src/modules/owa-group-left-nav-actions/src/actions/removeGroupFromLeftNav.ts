import type LeftNavGroupsSchema from 'owa-group-left-nav/lib/store/schema/LeftNavGroups';
import { action } from 'satcheljs/lib/legacy';

export default action('removeGroupFromLeftNav')(function removeGroupFromLeftNav(
    groupId: string,
    state: LeftNavGroupsSchema
) {
    const leftNavIndex = state.myOrgGroups.indexOf(groupId);
    if (leftNavIndex >= 0) {
        state.myOrgGroups.splice(leftNavIndex, 1);
    }
});
