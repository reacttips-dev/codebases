import { updateSelectedCalendarViewInStore } from '../actions/internalActions';
import { mutator } from 'satcheljs';
import { getStore } from '../store/store';

export const updateSelectedCalendarViewInStoreMutator = mutator(
    updateSelectedCalendarViewInStore,
    actionMessage => {
        const { updatedView } = actionMessage;
        getStore().selectedView = updatedView;
    }
);
