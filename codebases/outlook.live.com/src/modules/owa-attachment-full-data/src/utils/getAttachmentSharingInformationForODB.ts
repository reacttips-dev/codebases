import {
    AttachmentModel,
    lazyCreateAttachmentInfo,
    lazySetAttachmentInfo,
    refreshSharingTipsForAttachment,
} from 'owa-attachment-model-store';
import { AttachmentPolicyInfo, getAttachmentPolicyInfo } from 'owa-attachment-policy';
import { LinkProviderType } from 'owa-fileprovider-link';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import { lazyGetSharingInformation } from 'owa-sharing-data';
import { FileProviders } from 'owa-attachment-constants/lib/fileProviders';

export async function getAttachmentSharingInformationForODB(attachmentModel: AttachmentModel) {
    const getSharingInformation = await lazyGetSharingInformation.import();
    const referenceAttachment: ReferenceAttachment = attachmentModel.model as ReferenceAttachment;
    // Only ODB reference attachments will trigger the following call.
    if (referenceAttachment.ProviderType !== FileProviders.ONE_DRIVE_PRO) {
        return;
    }

    getSharingInformation(
        referenceAttachment.AttachLongPathName,
        LinkProviderType.OneDrivePro,
        false /* shouldUseReadWriteServer */
    ).then(async response => {
        if (!response || response.ResultCode !== AttachmentResultCode.Success) {
            return;
        }

        // TODO: VSO 33448, see if we should be calling initializeAttachment here instead of just setting the
        // attachment info.
        const attachmentPolicyInfo: AttachmentPolicyInfo = getAttachmentPolicyInfo(
            attachmentModel.model,
            true /* isWacPreviewSupportedOnPlatform */
        );

        const info = await lazyCreateAttachmentInfo.importAndExecute(
            attachmentPolicyInfo,
            attachmentModel.attachmentClass,
            attachmentModel.model,
            true /* isCloudy */,
            (<ReferenceAttachment>attachmentModel.model).ProviderType,
            response
        );
        lazySetAttachmentInfo.importAndExecute(attachmentModel.id, info);
        refreshSharingTipsForAttachment(attachmentModel.id);
    });
}
