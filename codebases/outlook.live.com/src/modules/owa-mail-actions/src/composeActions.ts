import { action } from 'satcheljs';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type { ActionSource } from 'owa-mail-store';

// This is a new version of the newMessage action built using SatchelV3. Ideally, newMessage action (and other mail compose actions) would be
// refactored to use SatchelV3, but that would be a huge change and is planned for the future (planned for Q12019). For now, the plan is to use the v3 version of
// newMessage action to trigger a newMessageV3 orchestrator that then calls the legacy newMessage
// The reason to do this is to improve the depdency graph so that consumers of newMessage don't need to take a dependecy on owa-mail-compose-actions
export let newMessageV3 = action(
    'NEW_MESSAGE_V3',
    (
        actionSource: ActionSource,
        groupId?: string,
        toEmailAddressWrappers?: EmailAddressWrapper[],
        subject?: string,
        body?: string
    ) => ({
        actionSource: actionSource,
        groupId: groupId,
        toEmailAddressWrappers: toEmailAddressWrappers,
        subject: subject,
        body: body,
    })
);

export const onCloseCompose = action('ON_CLOSE_COMPOSE', (closeReason: string) => ({
    closeReason,
}));
