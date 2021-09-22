import type { ComposeRecipientWellViewState } from 'owa-mail-compose-store';
import createRecipientWell from 'owa-readwrite-recipient-well/lib/utils/createRecipientWell';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('showCcWell', (viewState: ComposeRecipientWellViewState) => {
    if (!viewState.ccRecipientWell) {
        viewState.ccRecipientWell = createRecipientWell(
            viewState.toRecipientWell.findPeopleFeedbackManager,
            []
        );
    }
});
