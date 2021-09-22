import toggleCharm from '../actions/toggleCharm';
import { mutator } from 'satcheljs';
import { getStore } from '../store/store';

mutator(toggleCharm, actionMessage => {
    const charm = actionMessage.charm;
    const store = getStore();
    if (store.activeCharm === charm) {
        store.activeCharm = null;
    } else {
        store.activeCharm = charm;
    }
});
