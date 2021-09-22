import { resetIsContextMenuOpenForLinks, setIsContextMenuOpen } from '../actions/internalActions';
import getComposeLinkViewState from '../selectors/getComposeLinkViewState';
import getStore from '../store/store';
import { mutator } from 'satcheljs';

mutator(setIsContextMenuOpen, actionMessage => {
    const composeLinkViewState = getComposeLinkViewState(actionMessage.linkId);
    composeLinkViewState.isContextMenuOpen = actionMessage.value;
});

mutator(resetIsContextMenuOpenForLinks, actionMessage => {
    const store = getStore();
    store.composeLinks.forEach(link => (link.isContextMenuOpen = false));
});
