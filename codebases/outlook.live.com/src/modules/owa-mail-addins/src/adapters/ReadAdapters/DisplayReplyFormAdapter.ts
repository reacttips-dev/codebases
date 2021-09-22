import createAttachmentFiles from '../../utils/createAttachmentFiles';
import { getItem } from '../../utils/getItem';
import type { AttachmentDetails } from 'owa-addins-core';
import { getUserMailboxInfo } from 'owa-client-ids';
import { ComposeTarget } from 'owa-mail-compose-store';
import { lazyReplyToMessage } from 'owa-mail-compose-actions';
import type { ClientItem } from 'owa-mail-store';

export function displayReplyForm(
    referenceItemId: string,
    isReplyAll: boolean,
    htmlBody: string,
    attachments: AttachmentDetails[]
) {
    const item: ClientItem = getItem(referenceItemId);
    const conversationId = item ? item.ConversationId.Id : null;
    const attachmentFiles = createAttachmentFiles(attachments);
    lazyReplyToMessage.importAndExecute({
        referenceItemOrId: referenceItemId,
        mailboxInfo: getUserMailboxInfo(),
        isReplyAll: isReplyAll,
        useFullCompose: true,
        actionSource: 'AddIns',
        instrumentationContexts: [],
        conversationId: conversationId,
        body: htmlBody,
        fullComposeTarget: ComposeTarget.Popout,
        attachmentFiles: attachmentFiles,
    });
}
