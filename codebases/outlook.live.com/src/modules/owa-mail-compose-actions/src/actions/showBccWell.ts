import type { ComposeRecipientWellViewState } from 'owa-mail-compose-store';
import createRecipientWell from 'owa-readwrite-recipient-well/lib/utils/createRecipientWell';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('showBccWell', (viewState: ComposeRecipientWellViewState) => {
    if (!viewState.bccRecipientWell) {
        viewState.bccRecipientWell = createRecipientWell(
            viewState.toRecipientWell.findPeopleFeedbackManager,
            []
        );
    }
});
