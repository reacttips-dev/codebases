import { onDismissed } from '../actions/internalActions';
import { getStore } from '../store/store';
import { mutator } from 'satcheljs';

export const onDismissedMutator = mutator(onDismissed, () => {
    const store = getStore();
    store.showDialog = false;
});
