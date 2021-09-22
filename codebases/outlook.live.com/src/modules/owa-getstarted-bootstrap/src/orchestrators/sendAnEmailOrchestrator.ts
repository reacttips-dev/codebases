import { lazyNewMessage } from 'owa-mail-message-actions';
import { orchestrator } from 'satcheljs';
import { sendAnEmail } from 'owa-getstarted/lib/actions/sendAnEmail';
import { completeSendAnEmail } from 'owa-getstarted/lib/actions/completeSendAnEmail';
import { ComposeLifecycleEvent } from 'owa-mail-compose-store';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';

orchestrator(sendAnEmail, actionMessage => {
    lazyNewMessage.importAndExecute(
        'GetStarted',
        undefined,
        undefined,
        actionMessage.taskSendEmailSubject,
        actionMessage.taskSendEmailBody
    );
});

orchestrator(onComposeLifecycleEvent, actionMessage => {
    if (actionMessage.event == ComposeLifecycleEvent.MessageBeingSent) {
        completeSendAnEmail();
    }
});
