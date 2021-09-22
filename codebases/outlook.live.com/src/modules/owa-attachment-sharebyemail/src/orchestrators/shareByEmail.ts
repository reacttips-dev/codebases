import { shareByEmail } from '../actions/shareByEmail';
import type { AttachmentFile, AttachmentFileAttributes } from 'owa-attachment-file-types';
import { ComposeOperation, ComposeViewStateInitProps } from 'owa-mail-compose-store';
import { lazyOpenCompose } from 'owa-mail-compose-actions';
import { orchestrator } from 'satcheljs';
import { getGroupMailboxInfo } from 'owa-group-common';
import { getCurrentGroupSmtpAddress } from 'owa-groups-shared-store';
import { isGroupSelected } from 'owa-group-utils';

export default orchestrator(shareByEmail, async actionMessage => {
    const initProps: ComposeViewStateInitProps = {
        operation: ComposeOperation.New,
        bodyType: 'HTML',
        to: null,
        conversationId: '',
        attachmentFilesToUpload: actionMessage.attachments.map(
            (file: AttachmentFile) =>
                <AttachmentFileAttributes>{
                    file,
                    isInline: false,
                    mailboxInfo: isGroupSelected()
                        ? getGroupMailboxInfo(getCurrentGroupSmtpAddress())
                        : undefined,
                }
        ),
    };
    await lazyOpenCompose.importAndExecute(initProps, actionMessage.composeTarget);
});
