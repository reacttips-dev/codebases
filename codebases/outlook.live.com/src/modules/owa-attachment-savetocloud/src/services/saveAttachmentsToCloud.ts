import type { MailboxInfo } from 'owa-client-ids';
import saveAttachmentsToCloudRequest from 'owa-service/lib/factory/saveAttachmentsToCloudRequest';
import saveAttachmentsToCloudOperation from 'owa-service/lib/operation/saveAttachmentsToCloudOperation';
import { getMailboxRequestOptions } from 'owa-request-options-types';

function createRequestBody(
    attachmentId: string,
    itemId: string,
    subscriptionId: string,
    channelId: string,
    groupSmtpAddress: string,
    folderId?: string,
    attachmentIds?: string[]
) {
    return saveAttachmentsToCloudRequest({
        ewsAttachmentId: attachmentId,
        itemId: itemId,
        subscriptionId: subscriptionId,
        groupSmtpAddress: groupSmtpAddress,
        channelId: channelId,
        folderItemId: folderId,
        attachmentIds: attachmentIds,
    });
}

export default function saveAttachmentsToCloud(
    attachmentId: string,
    itemId: string,
    subscriptionId: string,
    channelId: string,
    mailboxInfo: MailboxInfo,
    folderId?: string,
    attachmentIds?: string[]
): Promise<string> {
    const groupMailboxSmtp =
        mailboxInfo?.type === 'GroupMailbox' ? mailboxInfo.mailboxSmtpAddress : null;

    const requestBody = createRequestBody(
        attachmentId,
        itemId,
        subscriptionId,
        channelId,
        groupMailboxSmtp,
        folderId,
        attachmentIds
    );

    return saveAttachmentsToCloudOperation(
        {
            requestObject: requestBody,
        },
        getMailboxRequestOptions(mailboxInfo)
    );
}
