import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';

export const forwardingNoticeDismissed = mutatorAction('FORWARDING_NOTICE_DISMISSED', () => {
    getStore().forwardingNotice.showForwardingNotice = false;
});
