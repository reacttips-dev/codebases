import { createMailItemFiles } from 'owa-attachment-file-types';
import type { ClientAttachmentId } from 'owa-client-ids';
import type { ComposeViewState } from 'owa-mail-compose-store';
import createAttachments from './createAttachments';

export default function addItem(
    viewState: ComposeViewState,
    attachmentName: string,
    itemId: string,
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

        const file = createMailItemFiles([attachmentName], [itemId]);
        createAttachments(
            file,
            viewState,
            {
                isInline,
                isHiddenInline: false,
                shouldShare: false,
            },
            onFinish,
            null /* onAttachmentCreatedCallback */,
            attachmentErrorHandler
        );
    });
}
