import { updateComposeLinkViewState } from '../actions/internalActions';
import getComposeLinkViewState from '../selectors/getComposeLinkViewState';
import { mutator } from 'satcheljs';

mutator(updateComposeLinkViewState, actionMessage => {
    const viewState = getComposeLinkViewState(actionMessage.linkId);
    viewState.isLinkBeautified = actionMessage.isLinkBeautified;
});
