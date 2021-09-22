import { mutatorAction } from 'satcheljs';
import type { ComposeViewState } from 'owa-mail-compose-store';

const disableSmartResponse = mutatorAction(
    'Compose_DisableSmartResponse',
    (viewState: ComposeViewState) => {
        viewState.useSmartResponse = false;
    }
);

export default disableSmartResponse;
