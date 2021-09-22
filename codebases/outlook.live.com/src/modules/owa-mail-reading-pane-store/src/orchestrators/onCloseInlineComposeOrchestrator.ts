import cleanUpAfterInlineComposeClosed from '../actions/cleanUpAfterInlineComposeClosed';
import { ComposeLifecycleEvent } from 'owa-mail-compose-store';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';
import { orchestrator } from 'satcheljs';

export const onCloseInlineComposeOrchestrator = orchestrator(
    onComposeLifecycleEvent,
    actionMessage => {
        if (actionMessage.event == ComposeLifecycleEvent.CloseInlineCompose) {
            cleanUpAfterInlineComposeClosed(actionMessage.viewState.conversationId);
        }
    }
);
