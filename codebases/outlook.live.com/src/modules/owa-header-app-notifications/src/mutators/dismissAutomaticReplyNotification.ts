import { mutator } from 'satcheljs';
import getStore from '../store/store';
import onDismissAutomaticReplyNotification from '../actions/onDismissAutomaticReplyNotification';

export default mutator(onDismissAutomaticReplyNotification, () => {
    getStore().showAutomaticRepliesNotification = false;
});
