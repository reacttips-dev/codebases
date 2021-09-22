import { orchestrator } from 'satcheljs';
import { newMessageV3 } from 'owa-mail-actions/lib/composeActions';
import { lazyNewMessage } from '../index';

// This is a new version of newMessage built using SatchelV3. Ideally, newMessage action (and other mail compose actions) would be
// refactored to use SatchelV3, but that would be a huge change and is planned for the future. For now, the plan is to use the v3 version of
// newMessage action to trigger a newMessageV3 orchestrator that then calls the legacy newMessage.
orchestrator(newMessageV3, actionMessage => {
    lazyNewMessage.importAndExecute(
        actionMessage.actionSource,
        actionMessage.groupId,
        actionMessage.toEmailAddressWrappers,
        actionMessage.subject,
        actionMessage.body
    );
});
