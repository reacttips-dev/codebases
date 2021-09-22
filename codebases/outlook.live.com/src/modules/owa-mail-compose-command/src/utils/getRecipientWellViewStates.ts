import { ComposeViewState } from 'owa-mail-compose-store';

export default function getRecipientWellViewStates(viewState: ComposeViewState) {
    let viewStates = [viewState.toRecipientWell];
    if (viewState.ccRecipientWell) {
        viewStates.push(viewState.ccRecipientWell);
    }
    if (viewState.bccRecipientWell) {
        viewStates.push(viewState.bccRecipientWell);
    }
    return viewStates;
}
