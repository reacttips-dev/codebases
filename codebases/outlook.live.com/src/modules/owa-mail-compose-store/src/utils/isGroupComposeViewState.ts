import { ComposeOperation } from '../store/schema/ComposeOperation';
import type { ComposeViewState } from '../store/schema/ComposeViewState';
import type { GroupComposeViewState } from '../store/schema/GroupComposeViewState';

export function isGroupScenario(
    viewState: ComposeViewState | GroupComposeViewState
): viewState is GroupComposeViewState {
    return (
        isGroupComposeViewState(viewState) &&
        viewStateHasGroupIdAsRecipient(<GroupComposeViewState>viewState)
    );
}

/* Group may have been removed from recipients since creating a group compose view state.
Check to see if the view state still contains the group as a recipient */
function viewStateHasGroupIdAsRecipient(groupComposeViewState: GroupComposeViewState) {
    // Short circuit this evaluation by first checking for Reply All operation,
    // since group cannot be removed from recipients in that scenario
    return (
        groupComposeViewState.operation == ComposeOperation.ReplyAll ||
        groupComposeViewState.toRecipientWell.recipients.some(recipient => {
            return (
                recipient.persona.EmailAddress.EmailAddress.toLowerCase() ===
                groupComposeViewState.groupId.toLowerCase()
            );
        })
    );
}

export default function isGroupComposeViewState(
    viewState: ComposeViewState | GroupComposeViewState
): viewState is GroupComposeViewState {
    return !!(<GroupComposeViewState>viewState).groupId;
}
