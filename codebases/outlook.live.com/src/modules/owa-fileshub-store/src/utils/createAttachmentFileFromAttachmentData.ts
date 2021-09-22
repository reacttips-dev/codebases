import { getAttachmentData } from '../selectors/getAttachmentData';
import type { AttachmentFile } from 'owa-attachment-file-types';
import { lazyGetAttachment } from 'owa-attachment-model-store';
import { lazyCreateAttachmentFileFromExistingMailboxAttachment } from 'owa-attachment-well-data';
import type { ClientAttachmentId } from 'owa-client-ids';

export async function createAttachmentFileFromAttachmentData(
    attachmentId: ClientAttachmentId
): Promise<AttachmentFile> {
    const createAttachmentFileFromExistingMailboxAttachment = await lazyCreateAttachmentFileFromExistingMailboxAttachment.import();

    // Get the AttachmentData from the files hub list store
    const attachmentData = getAttachmentData(attachmentId.Id);
    if (attachmentData) {
        return createAttachmentFileFromExistingMailboxAttachment(attachmentData.attachment.model);
    }
    // When an attachment does not exist in the fileshub list store, we get we get its data from the attachment store
    // This is the case when the a file is opened from Reading Pane in the SxS view because this item may not be loaded in the files list
    const attachmentModel = (await lazyGetAttachment.import())(attachmentId);
    return createAttachmentFileFromExistingMailboxAttachment(attachmentModel.model);
}
