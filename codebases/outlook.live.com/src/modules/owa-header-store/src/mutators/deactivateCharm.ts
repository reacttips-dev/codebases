import deactivateCharm from '../actions/deactivateCharm';
import { mutator } from 'satcheljs';
import { getStore } from '../store/store';

mutator(deactivateCharm, actionMessage => {
    const charm = actionMessage.charm;
    const store = getStore();
    if (store.activeCharm === charm) {
        store.activeCharm = null;
    }
});
