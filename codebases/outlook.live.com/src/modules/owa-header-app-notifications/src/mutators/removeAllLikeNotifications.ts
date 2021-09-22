import getStore from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'REMOVE_ALL_LIKE_NOTIFICATIONS',
    function removeAllLikeNotifications() {
        getStore().likeNotifications.splice(0, getStore().likeNotifications.length);
    }
);
