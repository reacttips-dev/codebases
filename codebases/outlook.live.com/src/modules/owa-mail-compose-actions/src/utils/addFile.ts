import { createUriFiles } from 'owa-attachment-file-types';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';
import type { ComposeViewState } from 'owa-mail-compose-store';
import createAttachments from './createAttachments';
import { onAttachmentCreated } from 'owa-attachment-well-data';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function addFile(
    viewState: ComposeViewState,
    attachmentName: string,
    uri: string,
    isInline: boolean
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let hasProcessed = false;

        const attachmentErrorHandler = (canceled: boolean) => {
            if (!hasProcessed) {
                hasProcessed = true;
                reject({ errorType: 'UploadError' });
            }
        };

        const onFinish = (attachmentId: ClientAttachmentId) => {
            if (!hasProcessed) {
                hasProcessed = true;
                resolve(attachmentId.Id);
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

        try {
            const file = createUriFiles([{ name: attachmentName, url: uri }]);

            createAttachments(
                file,
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
            reject({ errorType: 'UploadError' });
        }
    });
}
