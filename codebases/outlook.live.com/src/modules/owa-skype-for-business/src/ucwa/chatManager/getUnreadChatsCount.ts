import { getStore } from '../store/ucwaStore';

export default function getUnreadChatsCount() {
    return getStore().unreadCount;
}
