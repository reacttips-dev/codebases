import { AttachmentFileType, AttachmentFileAttributes } from 'owa-attachment-file-types';
import { ApiError, ApiErrorCode, AttachmentDetails } from 'owa-addins-core';
import {
    AttachmentState,
    lazyDeleteAttachmentsViaQueueManager,
    onAttachmentDeleted,
} from 'owa-attachment-well-data';
import type { ClientItemId, ClientAttachmentId } from 'owa-client-ids';
import type { ComposeViewState } from 'owa-mail-compose-store';
import addFile from 'owa-mail-compose-actions/lib/utils/addFile';
import addItem from 'owa-mail-compose-actions/lib/utils/addItem';
import createAttachmentFromBase64String from 'owa-mail-compose-actions/lib/utils/createAttachmentFromBase64String';
import { getCurrentTableMailboxInfo } from 'owa-mail-mailboxinfo';
import type { AttachmentContent } from 'owa-addins-common-utils/lib/getAttachmentContentHelper';
import { lazyGetAllAttachments } from 'owa-addins-common-utils';
import { getAttachmentContentUtil } from '../../utils/getAttachmentContentUtil';
import { isFeatureEnabled } from 'owa-feature-flags';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';

function getAttachmentError(messageId: string): ApiErrorCode {
    switch (messageId) {
        case 'ErrorTooLargeForLocalAttachmentSingle':
        case 'ErrorTooLargeForLocalAttachmentMultiple':
            return ApiErrorCode.AttachmentSizeExceeded;
        default:
            return ApiErrorCode.AttachmentUploadGeneralFailure;
    }
}

export const addItemAttachment = (viewState: ComposeViewState) => (
    attachmentName: string,
    itemId: string,
    isInline: boolean
): Promise<string> => {
    return addItem(viewState, attachmentName, itemId, isInline).catch(handleError);
};

function handleError(error: any): string {
    throw error.messageId
        ? getAttachmentError(error.messageId)
        : ApiErrorCode.AttachmentUploadGeneralFailure;
}

export const addFileAttachment = (viewState: ComposeViewState) => (
    attachmentName: string,
    uri: string,
    isInline: boolean
): Promise<string> => {
    return addFile(viewState, attachmentName, uri, isInline).catch(handleError);
};

export const getAttachments = (viewState: ComposeViewState) => (): Promise<AttachmentDetails[]> => {
    updateContentToViewState(viewState);
    return lazyGetAllAttachments.importAndExecute(viewState.attachmentWell, viewState.content);
};

export const addFileAttachmentFromBase64 = (viewState: ComposeViewState) => (
    base64File: string,
    attachmentName: string,
    isInline: boolean
): Promise<string> => {
    return createAttachmentFromBase64String(viewState, base64File, attachmentName, isInline).catch(
        handleError
    );
};

export function getAttachmentState(
    attachmentStates: AttachmentState[],
    attachmentId: string
): AttachmentState {
    const foundStates = attachmentStates.filter(state => state.attachmentId.Id === attachmentId);
    return foundStates.length > 0 ? foundStates[0] : null;
}

export const removeAttachment = (viewState: ComposeViewState) => (
    attachmentId: string
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        lazyDeleteAttachmentsViaQueueManager.import().then(deleteAttachmentViaQueueManager => {
            try {
                let attachmentState: AttachmentState = getAttachmentState(
                    viewState.attachmentWell.docViewAttachments,
                    attachmentId
                );
                if (!attachmentState) {
                    attachmentState = getAttachmentState(
                        viewState.attachmentWell.imageViewAttachments,
                        attachmentId
                    );
                }

                if (!attachmentState) {
                    attachmentState = getAttachmentState(
                        viewState.attachmentWell.inlineAttachments,
                        attachmentId
                    );
                }

                if (!attachmentState) {
                    reject(new ApiError(ApiErrorCode.AttachmentToDeleteDoesNotExist));
                    return;
                }

                const parentItemId: ClientItemId = {
                    ...viewState.itemId,
                    mailboxInfo: getCurrentTableMailboxInfo(),
                };

                const onAttachmentDeletedCallback = (
                    parentItemId: ClientItemId,
                    attachmentId: ClientAttachmentId,
                    attachment: AttachmentType
                ) => {
                    onAttachmentDeleted(
                        parentItemId,
                        attachmentId,
                        attachment,
                        //The param below decides whether to invoke AttachmentChangedHandler or not
                        !isFeatureEnabled('addin-fix-multipleCallbacksForAttachmentHandler')
                    );
                    resolve();
                };

                deleteAttachmentViaQueueManager(
                    viewState.attachmentWell,
                    attachmentState,
                    parentItemId,
                    viewState,
                    onAttachmentDeletedCallback
                );
            } catch {
                reject(new ApiError(ApiErrorCode.AttachmentDeleteGeneralFailure));
            }
        });
    });
};

export const getAttachmentContent = (viewState: ComposeViewState) => (
    attachmentId: string
): Promise<AttachmentContent> => {
    return getAttachmentContentUtil(viewState.attachmentWell, attachmentId);
};

export const hasInlineImage = (attachments: AttachmentFileAttributes[]): boolean => {
    if (!attachments || attachments.length == 0) {
        return false;
    }

    const existing = attachments.some((attachment: AttachmentFileAttributes) => {
        return attachment.file.fileType == AttachmentFileType.Uri && attachment.isInline;
    });

    return existing;
};
