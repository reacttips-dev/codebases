import store from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('updateUnreadConversationCount')(function updateUnreadConversationCount(
    unreadConversationCount: number
) {
    store.unreadConversationCount = unreadConversationCount;
});
