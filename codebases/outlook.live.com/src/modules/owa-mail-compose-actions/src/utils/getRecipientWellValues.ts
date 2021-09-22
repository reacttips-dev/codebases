import type { ComposeViewState } from 'owa-mail-compose-store';
import type { RecipientsCollection } from '../schema/RecipientsCollection';

// Exported for testing purposes only
export default function getRecipientWellValues(viewState: ComposeViewState): RecipientsCollection {
    return {
        toRecipients: viewState.toRecipientWell ? viewState.toRecipientWell.recipients : [],
        ccRecipients: viewState.ccRecipientWell ? viewState.ccRecipientWell.recipients : [],
        bccRecipients: viewState.bccRecipientWell ? viewState.bccRecipientWell.recipients : [],
    };
}
