import type { ComposeViewState } from 'owa-mail-compose-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setHandledByDelaySend',
    function setHandledByDelaySend(viewState: ComposeViewState, handledByDelaySend: boolean) {
        viewState.handledByDelaySend = handledByDelaySend;
    }
);
