import { updateComposeLinkViewState } from '../actions/internalActions';
import getComposeLinkViewState from '../selectors/getComposeLinkViewState';
import { updateSharingLinkUrl } from 'owa-link-data';
import { mutator } from 'satcheljs';

mutator(updateComposeLinkViewState, actionMessage => {
    const viewState = getComposeLinkViewState(actionMessage.linkId);
    if (viewState) {
        viewState.displayName = actionMessage.displayName;
    }
});

mutator(updateSharingLinkUrl, actionMessage => {
    const viewState = getComposeLinkViewState(actionMessage.linkId);
    if (
        viewState &&
        !viewState.isLinkBeautified &&
        viewState.displayName === actionMessage.oldLinkUrl
    ) {
        viewState.displayName = actionMessage.newLinkUrl;
    }
});
