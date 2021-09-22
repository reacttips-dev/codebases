import type { ComposeViewState } from 'owa-mail-compose-store';
import getRecipientsCount from './getRecipientsCount';

export function isViewStateDirty(context: ComposeViewState): boolean {
    return (
        context.isDirty ||
        context.toRecipientWell?.isDirty ||
        context.ccRecipientWell?.isDirty ||
        context.bccRecipientWell?.isDirty
    );
}

export function getTotalRecipientCount(context: ComposeViewState): number {
    return (
        getRecipientsCount(context.toRecipientWell) +
        getRecipientsCount(context.ccRecipientWell) +
        getRecipientsCount(context.bccRecipientWell)
    );
}
