import { setIsFlexPaneShown } from '../actions/publicActions';
import { mutator } from 'satcheljs';
import { getStore } from '../store/store';

export const setIsFlexPaneShownMutator = mutator(setIsFlexPaneShown, actionMessage => {
    getStore().isFlexPaneShown = actionMessage.isShown;
});
