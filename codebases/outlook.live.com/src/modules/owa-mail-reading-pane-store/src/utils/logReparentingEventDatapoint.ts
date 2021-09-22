import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import { logUsage } from 'owa-analytics';
import type { ComposeViewState } from 'owa-mail-compose-store';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import mailStore from 'owa-mail-store/lib/store/Store';
import type Message from 'owa-service/lib/contract/Message';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import hasMoreRecipientsOnServer from 'owa-recipient-common/lib/utils/hasMoreRecipientsOnServer';

export default function logReParentingEventDatapoint(
    addedNodeIds: string[],
    conversationId: string
) {
    // The ReParenting scenario would happen when a new message arrives for the conversation the user is currently inline replying to.
    // First check that there's an inline compose and that only one node was added to avoid capturing the load more scenario.

    if (addedNodeIds.length == 1) {
        const inlineComposeViewState = findInlineComposeViewState(conversationId);
        if (inlineComposeViewState) {
            // We also need to verify that the new node is at the "end" of the collection since it's possible that load more returns 1 new node.
            const conversation = mailStore.conversations.get(conversationId);
            const indexOfNewestNode = isNewestOnBottom()
                ? conversation.conversationNodeIds.length - 1
                : 0;
            const newestNodeId = conversation.conversationNodeIds[indexOfNewestNode];
            if (addedNodeIds[0] == newestNodeId) {
                // Finally make sure the new node isn't a draft
                const newestNode = mailStore.conversationNodes.get(newestNodeId);
                const item = mailStore.items.get(newestNode && newestNode.itemIds[0]);
                if (item && !item.IsDraft) {
                    const [
                        draftHasBcc,
                        recipientsOnServer,
                        recipientsAdded,
                        recipientsDropped,
                    ] = getRecipientData(inlineComposeViewState, <Message>item);

                    logUsage('RPCountReParentingEvent', [
                        draftHasBcc,
                        recipientsOnServer,
                        recipientsAdded,
                        recipientsDropped,
                    ]);
                }
            }
        }
    }
}

function getRecipientData(
    draftViewState: ComposeViewState,
    message: Message
): [boolean, boolean, boolean, boolean] {
    let recipientsAdded = false;
    let recipientsDropped = false;
    const draftHasBcc = draftViewState.bccRecipientWell
        ? draftViewState.bccRecipientWell.recipients.length > 0
        : false;
    const { ToRecipients, CcRecipients, BccRecipients, RecipientCounts } = message;
    const recipientsOnServer = hasMoreRecipientsOnServer(
        RecipientCounts,
        ToRecipients,
        CcRecipients,
        BccRecipients
    );
    if (!recipientsOnServer && !draftHasBcc) {
        [recipientsAdded, recipientsDropped] = compareRecipients(draftViewState, message);
    }

    return [draftHasBcc, recipientsOnServer, recipientsAdded, recipientsDropped];
}

function compareRecipients(draftViewState: ComposeViewState, message: Message): [boolean, boolean] {
    const draftRecipients = getAllRecipientsFromViewState(draftViewState);
    const newRecipients = getAllRecipientsFromMessage(message);
    let recipientsAdded = false;
    let recipientsDropped = false;
    for (const draftRecipient of draftRecipients) {
        if (newRecipients.indexOf(draftRecipient) == -1) {
            recipientsDropped = true;
            break;
        }
    }

    for (const newRecipient of newRecipients) {
        if (draftRecipients.indexOf(newRecipient) == -1) {
            recipientsAdded = true;
            break;
        }
    }

    return [recipientsAdded, recipientsDropped];
}

function getAllRecipientsFromViewState(viewState: ComposeViewState): string[] {
    const recipients = [];
    const { toRecipientWell, ccRecipientWell } = viewState;
    for (const recipient of toRecipientWell.recipients) {
        if (recipient.persona.EmailAddress.EmailAddress) {
            recipients.push(recipient.persona.EmailAddress.EmailAddress.toLowerCase());
        }
    }
    if (ccRecipientWell) {
        for (const recipient of ccRecipientWell.recipients) {
            if (recipient.persona.EmailAddress.EmailAddress) {
                recipients.push(recipient.persona.EmailAddress.EmailAddress.toLowerCase());
            }
        }
    }

    recipients.push(getUserConfiguration().SessionSettings.UserEmailAddress.toLowerCase());

    return recipients;
}

function getAllRecipientsFromMessage(message: Message): string[] {
    const { ToRecipients, CcRecipients } = message;
    const recipients = [];
    for (const recipient of ToRecipients) {
        if (recipient.EmailAddress) {
            recipients.push(recipient.EmailAddress.toLowerCase());
        }
    }
    if (CcRecipients) {
        for (const recipient of CcRecipients) {
            if (recipient.EmailAddress) {
                recipients.push(recipient.EmailAddress.toLowerCase());
            }
        }
    }

    if (message.From?.Mailbox?.EmailAddress) {
        recipients.push(message.From.Mailbox.EmailAddress.toLowerCase());
    }

    return recipients;
}
