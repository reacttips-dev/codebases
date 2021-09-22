import { mutatorAction } from 'satcheljs';
import { getGroupsStore } from './../GroupsStore';

export default mutatorAction(
    'UPDATE_GROUP_UNREAD_COUNT',
    function updateGroupUnreadCount(groupId: string, unreadCount: number) {
        let group = getGroupsStore().groups.get(groupId.toLowerCase());
        if (group) {
            group.unreadMessageCount = unreadCount;
        }
    }
);
