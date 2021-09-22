import type ComposeLinkViewState from '../store/schema/ComposeLinkViewState';
import getStore from '../store/store';
import { getLinkIdFromAnchorElementId } from 'owa-link-data';

export default function getComposeLinkViewState(linkId: string): ComposeLinkViewState {
    const store = getStore();

    linkId = getLinkIdFromAnchorElementId(linkId);

    return store.composeLinks.get(linkId);
}
