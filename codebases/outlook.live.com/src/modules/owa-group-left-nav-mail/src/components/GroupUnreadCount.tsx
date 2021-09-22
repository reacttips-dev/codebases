import { observer } from 'mobx-react-lite';
import { getGroupsStore } from 'owa-groups-shared-store';
import { UnreadReadCountBadge } from 'owa-unreadread-count-badge';
import * as React from 'react';
import { isGroupNodeSelected } from 'owa-mail-folder-forest-actions';

export interface GroupUnreadCountProps {
    groupId: string;
}

const GroupUnreadCount = observer(function GroupUnreadCount(props: GroupUnreadCountProps) {
    const { groupId } = props;
    const groupsStore = getGroupsStore();
    const group = groupsStore.groups.get(props.groupId.toLowerCase());
    const unreadMessageCount = group ? group.unreadMessageCount : null;

    // check that count exists and is not equal to 0
    return (
        <UnreadReadCountBadge
            count={unreadMessageCount}
            isSelected={isGroupNodeSelected(groupId, 'groups')}
        />
    );
});
export default GroupUnreadCount;
