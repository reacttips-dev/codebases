import type { ComposeViewState } from 'owa-mail-compose-store';
import { action } from 'satcheljs/lib/legacy';

export default action('setNumberOfWaitingAttachments')(function setNumberOfWaitingAttachments(
    viewState: ComposeViewState,
    numberOfWaitingAttachments: number
) {
    if (numberOfWaitingAttachments < 0) {
        return;
    }

    viewState.numberOfWaitingAttachments = numberOfWaitingAttachments;
});
