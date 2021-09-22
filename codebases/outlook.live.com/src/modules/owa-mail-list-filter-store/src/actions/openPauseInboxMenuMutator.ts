import { getStore } from '../store/Store';
import { mutator } from 'satcheljs';
import { openPauseInboxMenu } from 'owa-whats-new';

mutator(openPauseInboxMenu, actionMessage => {
    // Open filter menu
    getStore().filterContextMenuDisplayState = true;
});
