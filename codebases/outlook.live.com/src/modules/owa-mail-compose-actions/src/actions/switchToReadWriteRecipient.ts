import type { ComposeViewState } from 'owa-mail-compose-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'switchToReadWriteRecipient',
    function switchToReadWriteRecipient(viewState: ComposeViewState) {
        viewState.showCompactRecipientWell = false;
    }
);
