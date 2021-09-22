import {
    ComposeOperation,
    GroupComposeViewState,
    GroupComposeViewStateInitProps,
} from 'owa-mail-compose-store';
import { getGroupDisplayName } from 'owa-group-utils/lib/utils/getGroupDisplayName';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import createMailComposeViewState from './createMailComposeViewState';

export default function createGroupComposeViewState(
    props: GroupComposeViewStateInitProps
): GroupComposeViewState {
    // Make sure the current group is present in to line if it's not a forward scenario
    if (props.operation != ComposeOperation.Forward && !hasGroupInToRecipients(props)) {
        if (!props.to) {
            props.to = [];
        }

        const groupDisplayName = getGroupDisplayName(props.groupId);
        props.to.push({
            EmailAddress: props.groupId,
            Name: groupDisplayName,
            RoutingType: 'SMTP',
            MailboxType: 'GroupMailbox',
        });
    }

    const groupComposeViewState: GroupComposeViewState = {
        ...createMailComposeViewState(props),
        groupId: props.groupId,
        lastSavedMessageBody: null,
    };
    groupComposeViewState.attachmentWell.groupId = props.groupId;

    // For replyAll scenario, we do not allow user to remove group from to line
    if (props.operation === ComposeOperation.ReplyAll) {
        markGroupRecipientAsBlockedFromRemoval(
            props.groupId,
            groupComposeViewState.toRecipientWell
        );
    }

    return groupComposeViewState;
}

function hasGroupInToRecipients(props: GroupComposeViewStateInitProps): boolean {
    if (!props.to || !props.groupId) {
        return false;
    }

    const groupIdLowerCase = props.groupId.toLowerCase();
    for (const recipient of props.to) {
        const recipientEmail = recipient.EmailAddress && recipient.EmailAddress.toLowerCase();
        if (recipientEmail === groupIdLowerCase) {
            return true;
        }
    }

    return false;
}

function markGroupRecipientAsBlockedFromRemoval(
    groupId: string,
    toRecipientWell: RecipientWellWithFindControlViewState
) {
    if (!groupId) {
        return;
    }

    const groupIdLowerCase = groupId.toLowerCase();
    for (const recipient of toRecipientWell.recipients) {
        const recipientEmail =
            recipient.persona.EmailAddress.EmailAddress &&
            recipient.persona.EmailAddress.EmailAddress.toLowerCase();
        if (
            recipient.persona.EmailAddress.MailboxType === 'GroupMailbox' &&
            recipientEmail === groupIdLowerCase
        ) {
            recipient.blockWellItemRemoval = true;
            break;
        }
    }
}
