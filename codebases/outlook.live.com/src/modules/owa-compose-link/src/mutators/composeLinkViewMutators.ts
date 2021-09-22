import { removeComposeLinkViewState } from '../actions/internalActions';
import { addComposeLinkViewState, removeAllComposeLinkViewStates } from '../actions/publicActions';
import type ComposeLinkViewState from '../store/schema/ComposeLinkViewState';
import getStore from '../store/store';
import { mutator } from 'satcheljs';
import { getLinkIdFromAnchorElementId } from 'owa-link-data';

mutator(addComposeLinkViewState, actionMessage => {
    const store = getStore();
    const linkId: string = getLinkIdFromAnchorElementId(actionMessage.linkId);
    const composeLinkViewState: ComposeLinkViewState = {
        linkId: linkId,
        isContextMenuOpen: false,
        isLinkBeautified: false,
        displayName: null,
    };

    store.composeLinks.set(linkId, composeLinkViewState);
});

mutator(removeComposeLinkViewState, actionMessage => {
    const store = getStore();
    const linkId: string = getLinkIdFromAnchorElementId(actionMessage.linkId);
    store.composeLinks.delete(linkId);
});

mutator(removeAllComposeLinkViewStates, actionMessage => {
    const store = getStore();
    store.composeLinks.clear();
});
