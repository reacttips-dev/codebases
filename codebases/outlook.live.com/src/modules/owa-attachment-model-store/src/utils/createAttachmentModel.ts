import { getTypeOfAttachment, TypeOfAttachment } from 'owa-attachment-type';
import AttachmentClass from '../store/schema/AttachmentClass';
import type {
    default as AttachmentModel,
    ReferenceAttachmentModel,
} from '../store/schema/AttachmentModel';
import { isAttachmentOfReferenceType } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';
import type { ClientAttachmentId } from 'owa-client-ids';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

export default function createAttachmentModel(
    attachmentId: ClientAttachmentId,
    attachment: AttachmentType
): AttachmentModel {
    const attachmentModel: AttachmentModel = {
        id: attachmentId,
        type: getTypeOfAttachment(attachment),
        download: {
            url: null,
        },
        attachmentClass: AttachmentClass.Default,
        previewImage: {
            url: null,
        },
        thumbnailImage: {
            url: null,
        },
        info: {
            allowDownload: false,
            supportedPermissionLevels: [],
            sharingInfo: null,
        },
        model: attachment,
    };

    if (
        attachmentModel.type === TypeOfAttachment.Reference &&
        isAttachmentOfReferenceType(attachment)
    ) {
        const referenceAttachmentModel: ReferenceAttachmentModel = {
            ...attachmentModel,
            type: TypeOfAttachment.Reference,
            openUrl: null,
            originalUrl: null,
            isFolder: attachment.AttachmentIsFolder,
            requiresFetchingSharingInformation: false,
        };

        return referenceAttachmentModel;
    }

    return attachmentModel;
}
