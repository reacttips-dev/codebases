import { showModal } from 'owa-modal';
import { HipCheckModal } from 'owa-mail-hip-check-modal';
import moveComposeToTab from '../actions/moveComposeToTab';
import type { ComposeViewState } from 'owa-mail-compose-store';
import trySendMessage from '../actions/trySendMessage';

export async function presentHipChallengeOnSendFail(
    viewState: ComposeViewState,
    targetWindow: Window
) {
    const [showModalPromise] = showModal(HipCheckModal, targetWindow);
    const result = await showModalPromise;
    if (!result.success) {
        // If the user does not clear the hip check immediately, give them a way to re-open the modal
        // (the verify infobar)
        moveComposeToTab(viewState, true /* isShown */, true /* makeActive */);
    } else {
        // Otherwise, retry the send immediately
        trySendMessage(viewState, targetWindow);
    }
}
