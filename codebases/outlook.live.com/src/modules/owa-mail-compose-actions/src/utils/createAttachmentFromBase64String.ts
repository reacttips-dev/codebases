import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';
import type { ComposeViewState } from 'owa-mail-compose-store';
import createAttachments from './createAttachments';
import {
    createBase64File,
    AttachmentFileType,
    Base64InlineImageFile,
    createLocalComputerFiles,
} from 'owa-attachment-file-types';
import { ApiErrorCode } from 'owa-addins-core';
import { onAttachmentCreated } from 'owa-attachment-well-data';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type { AttachmentBlob } from './attachmentBlob';
import { isImageFile, getMimeTypeFromExtension, getExtensionFromFileName } from 'owa-file';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function createAttachmentFromBase64String(
    viewState: ComposeViewState,
    base64String: string,
    attachmentName: string,
    isInline: boolean
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let hasProcessed = false;

        const attachmentErrorHandler = () => {
            if (!hasProcessed) {
                hasProcessed = true;
                reject({ errorType: 'UploadError' });
            }
        };

        const onAttachmentCreatedCallback = (
            parentItemId: ClientItemId,
            attachmentId: ClientAttachmentId,
            attachment: AttachmentType
        ) => {
            onAttachmentCreated(
                parentItemId,
                attachmentId,
                attachment,
                //The param below decides whether to invoke AttachmentChangedHandler or not
                !isFeatureEnabled('addin-fix-multipleCallbacksForAttachmentHandler')
            );
            resolve(attachmentId.Id);
        };

        const onFinish = (attachmentId: ClientAttachmentId) => {
            if (!hasProcessed) {
                hasProcessed = true;
                resolve(attachmentId.Id);
            }
        };

        try {
            let AttachmentFile;
            const isImage = isImageFile(attachmentName);
            const extension = getExtensionFromFileName(attachmentName);
            const imagetype = getMimeTypeFromExtension(extension);

            if (isInline && isImage) {
                const base64InlineImageFile: Base64InlineImageFile = {
                    name: attachmentName,
                    size: 0, // default to 0 since we cannot get size of image with src as data uri.
                    dataUri: base64String,
                    fileType: AttachmentFileType.Base64InlineImage,
                    type: imagetype ? imagetype : 'image/png',
                };
                AttachmentFile = createBase64File([base64InlineImageFile]);
            } else {
                const attachmentContent = atob(base64String);
                const attachmentContentLength = attachmentContent.length;
                const byteArray = new Uint8Array(new ArrayBuffer(attachmentContentLength));

                for (let i = 0; i < attachmentContentLength; i++) {
                    byteArray[i] = attachmentContent.charCodeAt(i);
                }

                let blob: Blob = null;
                blob = isImage
                    ? new Blob([byteArray], {
                          type: imagetype ? imagetype : 'image/png',
                      })
                    : new Blob([byteArray]);
                var attachmentBlob: AttachmentBlob = blob;
                attachmentBlob.name = attachmentName;

                AttachmentFile = createLocalComputerFiles([<File>attachmentBlob]);
            }

            createAttachments(
                AttachmentFile,
                viewState,
                {
                    isInline,
                    isHiddenInline: true,
                    shouldShare: false,
                },
                onFinish,
                onAttachmentCreatedCallback,
                attachmentErrorHandler
            );
        } catch (err) {
            reject({ errorType: ApiErrorCode.AttachmentUploadGeneralFailure });
        }
    });
}
