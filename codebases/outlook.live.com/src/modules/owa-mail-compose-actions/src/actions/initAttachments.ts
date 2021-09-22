import addAttachments from '../utils/addAttachments';
import hasInlineImage from '../utils/hasInlineImage';
import triggerContentChangedEvent from 'owa-editor/lib/utils/triggerContentChangedEvent';
import { AttachmentWellViewState, lazyGetAttachmentWellForCompose } from 'owa-attachment-well-data';
import type { ComposeViewState, InitAttachmentsTask } from 'owa-mail-compose-store';
import { getUserMailboxInfo } from 'owa-client-ids';
import { mutatorAction } from 'satcheljs';

export default async function initAttachments(
    viewState: ComposeViewState,
    task: InitAttachmentsTask
) {
    const { attachments, attachmentFilesToUpload } = task;
    if (attachments?.length > 0) {
        const getAttachmentWellForCompose = await lazyGetAttachmentWellForCompose.import();
        const attachmentWell = getAttachmentWellForCompose(viewState.composeId, {
            attachments,
            mailboxInfo: getUserMailboxInfo(),
            parentItemId: viewState.itemId || null,
        });

        setAttachmentWellViewState(viewState, attachmentWell);
    }

    if (attachmentFilesToUpload?.length > 0) {
        addAttachments(viewState, attachmentFilesToUpload).then(() => {
            if (hasInlineImage(attachmentFilesToUpload)) {
                triggerContentChangedEvent(viewState, 'Addins');
            }
        });
    }
}

const setAttachmentWellViewState = mutatorAction(
    'Compose_SetAttachmentWellViewState',
    (viewState: ComposeViewState, attachmentWell: AttachmentWellViewState) => {
        viewState.attachmentWell = attachmentWell;
    }
);
