import { orchestrator } from 'satcheljs';
import { turnOffFocusedInbox } from 'owa-fms-action-providers';
import { lazySetFocusedInboxOnOff } from 'owa-mail-focused-inbox-config';

export default orchestrator(turnOffFocusedInbox, message => {
    lazySetFocusedInboxOnOff.importAndExecute(false, false);
});
