import type { ComposeViewState } from 'owa-mail-compose-store';
import { action } from 'satcheljs';

export default action(
    'conversationSendStateChanged',
    (viewState: ComposeViewState, isSendPending: boolean) => ({
        viewState,
        isSendPending,
    })
);
