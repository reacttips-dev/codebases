import type { AttachmentWellViewState } from 'owa-attachment-well-data';
import { lazyLoadFromAttachmentServiceUrl } from 'owa-inline-image-loader';
import type { IEditor } from 'roosterjs-editor-types';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';

// Inline image CID fix
const CID_PREFIX = 'cid:';
const CONTEXT_MOVEFROMATTACHMENTWELL = 'MoveFromAttachmentWell';

export default function convertAllContentIdToAttachmentUrl(
    editor: IEditor,
    viewState: AttachmentWellViewState,
    loadFromAttachmentServiceUrl?
) {
    const callback = loadFromAttachmentServiceUrl => {
        editor?.queryElements<HTMLImageElement>(`img[src^="${CID_PREFIX}"]`, image => {
            const cidOrName = image.src.substr(CID_PREFIX.length);
            const imageAttributes = fixInlineImageSrc(viewState, cidOrName);
            if (imageAttributes) {
                image.setAttribute('originalsrc', CID_PREFIX + imageAttributes.contentId);
                loadFromAttachmentServiceUrl(
                    image,
                    imageAttributes.url,
                    CONTEXT_MOVEFROMATTACHMENTWELL
                );
            }
        });
    };
    if (loadFromAttachmentServiceUrl) {
        callback(loadFromAttachmentServiceUrl);
    } else {
        lazyLoadFromAttachmentServiceUrl.import().then(callback);
    }
}

export function fixInlineImageSrc(viewState: AttachmentWellViewState, cidOrName: string) {
    if (viewState.inlineAttachments) {
        for (const attachmentData of viewState.inlineAttachments) {
            const attachment = getAttachment(attachmentData.attachmentId);
            if (
                attachment?.thumbnailImage &&
                attachment.model &&
                (attachment.model.ContentId == cidOrName || attachment.model.Name == cidOrName)
            ) {
                return {
                    url: attachment.thumbnailImage.url,
                    contentId: attachment.model.ContentId,
                };
            }
        }
    }

    return null;
}
