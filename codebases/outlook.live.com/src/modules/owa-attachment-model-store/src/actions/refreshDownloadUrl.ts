import getAttachment from '../selectors/getAttachment';
import type AttachmentModel from '../store/schema/AttachmentModel';
import getFullFileDownloadUrl from '../utils/getFullFileDownloadUrl';
import type { ClientAttachmentId } from 'owa-client-ids';
import { action } from 'satcheljs/lib/legacy';

export default action('refreshDownloadUrl')(function refreshDownloadUrl(
    attachmentId: ClientAttachmentId,
    isReadOnly: boolean,
    addIsDownloadQueryParam: boolean = false
) {
    const attachment: AttachmentModel = getAttachment(attachmentId);
    const url = getFullFileDownloadUrl(
        attachmentId,
        attachment.model,
        isReadOnly,
        addIsDownloadQueryParam
    );
    attachment.download.url = url;
});
