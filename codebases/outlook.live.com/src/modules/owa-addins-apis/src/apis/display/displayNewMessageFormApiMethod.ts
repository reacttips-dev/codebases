import ApiLimits from '../ApiLimits';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import isValidEmailAddress from '../recipients/isValidEmailAddress';
import trySanitizeHtml from '../body/trySanitizeHtml';
import type { ApiMethodCallback } from '../ApiMethod';
import { createAttachmentFromDisplayFormArgs } from '../attachments/AttachmentsFactory';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, MessageReadAdapter } from 'owa-addins-adapters';

export interface DisplayNewMessageFormArgs {
    toRecipients?: string[];
    ccRecipients?: string[];
    bccRecipients?: string[];
    subject?: string;
    htmlBody?: string;
    attachments?: string[][];
}

export default async function displayNewMessageFormApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayNewMessageFormArgs,
    callback: ApiMethodCallback
) {
    let recipientsExceededLimit = false;
    const [toRecipients, ccRecipients, bccRecipients] = [
        data.toRecipients,
        data.ccRecipients,
        data.bccRecipients,
    ].map(recipients => {
        if (!recipients) {
            return [];
        }

        if (recipients.length > ApiLimits.MaxRecipientsPerCall) {
            recipientsExceededLimit = true;
            return null;
        }

        return formatRecipientsToEmailAddressWrappers(recipients);
    });
    if (recipientsExceededLimit) {
        callback(createErrorResult());
        return;
    }

    let subject = '';
    if (data.subject) {
        if (data.subject.length > ApiLimits.MaxSubjectLength) {
            callback(createErrorResult());
            return;
        }
        subject = data.subject;
    }

    let htmlBody = '';
    if (data.htmlBody) {
        if (data.htmlBody.length > ApiLimits.MaxBodyLengthOnDisplayApis) {
            callback(createErrorResult());
            return;
        }

        htmlBody = await trySanitizeHtml(data.htmlBody);
        if (htmlBody == null) {
            callback(createErrorResult());
            return;
        }
    }

    let attachments = [];
    if (data.attachments) {
        if (data.attachments.length > ApiLimits.MaxAttachmentNumberOnDisplayApis) {
            callback(createErrorResult());
            return;
        }
        attachments = data.attachments.map(createAttachmentFromDisplayFormArgs);
    }

    const adapter: MessageReadAdapter = getAdapter(hostItemIndex) as MessageReadAdapter;
    await adapter.displayNewMessageForm(
        toRecipients,
        ccRecipients,
        bccRecipients,
        subject,
        htmlBody,
        attachments
    );
    callback(createSuccessResult());
}

function formatRecipientsToEmailAddressWrappers(recipients: string[]): EmailAddressWrapper[] {
    const emailAddressWrappers: EmailAddressWrapper[] = [];
    recipients.forEach(recipient => {
        if (isValidEmailAddress(recipient)) {
            emailAddressWrappers.push(<EmailAddressWrapper>{
                Name: recipient,
                EmailAddress: recipient,
                MailboxType: 'OneOff',
                RoutingType: 'SMTP',
            });
        } // if email address is invalid, skip
    });
    return emailAddressWrappers;
}
