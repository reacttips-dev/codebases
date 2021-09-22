import createAttachmentFiles from '../../utils/createAttachmentFiles';
import type { AttachmentDetails } from 'owa-addins-core';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { lazyOpenCompose } from 'owa-mail-compose-actions';
import { ComposeOperation, ComposeTarget, ComposeViewStateInitProps } from 'owa-mail-compose-store';

export function displayNewMessageForm(
    toRecipients?: EmailAddressWrapper[],
    ccRecipients?: EmailAddressWrapper[],
    bccRecipients?: EmailAddressWrapper[],
    subject?: string,
    htmlBody?: string,
    attachments?: AttachmentDetails[]
) {
    const composeInitProps = <ComposeViewStateInitProps>{
        operation: ComposeOperation.New,
        bodyType: 'HTML',
        subject: subject,
        newContent: htmlBody,
        to: toRecipients,
        cc: ccRecipients,
        bcc: bccRecipients,
        preferAsyncSend: true,
        attachmentFilesToUpload: createAttachmentFiles(attachments),
    };
    lazyOpenCompose.importAndExecute(composeInitProps, ComposeTarget.Popout);
}
