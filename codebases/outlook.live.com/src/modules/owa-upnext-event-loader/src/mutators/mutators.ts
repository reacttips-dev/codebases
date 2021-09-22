import { mutator } from 'satcheljs';
import { updateUpNextEvent } from '../actions/internalActions';
import { getUpNextStore } from '../store/store';

mutator(updateUpNextEvent, actionMessage => {
    getUpNextStore().scenarios.set(actionMessage.eventsCacheLockId, actionMessage.id);
});
