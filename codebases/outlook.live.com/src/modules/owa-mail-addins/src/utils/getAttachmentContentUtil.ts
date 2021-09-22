import type { AttachmentWellViewState, AttachmentState } from 'owa-attachment-well-data';
import { lazyGetAttachmentContentHelper } from 'owa-addins-common-utils';
import type { AttachmentContent } from 'owa-addins-common-utils/lib/getAttachmentContentHelper';
import { getAttachmentState } from '../adapters/ComposeAdapters/AttachmentAdapter';
import { ApiError, ApiErrorCode } from 'owa-addins-core';

export function getAttachmentContentUtil(
    attachmentWell: AttachmentWellViewState,
    attachmentId: string
): Promise<AttachmentContent> {
    let attachmentState: AttachmentState = getAttachmentState(
        attachmentWell.docViewAttachments,
        attachmentId
    );
    if (!attachmentState) {
        attachmentState = getAttachmentState(attachmentWell.imageViewAttachments, attachmentId);
    }
    if (!attachmentState) {
        attachmentState = getAttachmentState(attachmentWell.inlineAttachments, attachmentId);
    }
    if (!attachmentState) {
        throw new ApiError(ApiErrorCode.GenericResponseError);
    }

    return lazyGetAttachmentContentHelper.importAndExecute(attachmentState, attachmentId);
}
