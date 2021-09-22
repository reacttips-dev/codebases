import { isFeatureEnabled } from 'owa-feature-flags';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import createAttachmentInfo from './createAttachmentInfo';
import getAttachmentClass from './getAttachmentClass';
import type {
    default as AttachmentModel,
    ReferenceAttachmentModel,
} from '../../store/schema/AttachmentModel';
import getDataProviderInfo from '../../utils/DataProviderInfo/getDataProviderInfo';
import getAttachmentThumbnailUrl from '../../utils/getAttachmentThumbnailUrl';
import getCloudyAttachmentOriginalUrl from '../../utils/getCloudyAttachmentOriginalUrl';
import getFullFileDownloadUrl from '../../utils/getFullFileDownloadUrl';
import getOpenUrlForReferenceAttachment from '../../utils/getOpenUrlForReferenceAttachment';
import isCloudyAttachment from '../../utils/isCloudyAttachment';
import shouldShowImageView from '../../utils/shouldShowImageView';
import { AttachmentPolicyInfo, getAttachmentPolicyInfo } from 'owa-attachment-policy';
import type GetSharingInfoResponse from 'owa-service/lib/contract/GetSharingInfoResponse';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import getStore from '../../store/store';

export default async function initializeAttachment(
    attachment: AttachmentModel,
    permissionInfo: GetSharingInfoResponse,
    isReadOnly: boolean
): Promise<void> {
    const isCloudy = isCloudyAttachment(attachment);
    const attachmentPolicyInfo: AttachmentPolicyInfo = getAttachmentPolicyInfo(
        attachment.model,
        true /* isWacPreviewSupportedOnPlatform */
    );

    const attachmentClass = getAttachmentClass(attachmentPolicyInfo, attachment.model);
    attachment.attachmentClass = attachmentClass;

    attachment.info = createAttachmentInfo(
        attachmentPolicyInfo,
        attachmentClass,
        attachment.model,
        isCloudy,
        isCloudy ? (<ReferenceAttachment>attachment.model).ProviderType : null,
        permissionInfo
    );

    // Initialize download URL
    if (attachment.info.allowDownload) {
        attachment.download.url = getFullFileDownloadUrl(
            attachment.id,
            attachment.model,
            true /* isReadOnly */,
            true /* addIsDownloadQueryParam */
        );
    }

    if (isCloudy) {
        (<ReferenceAttachmentModel>attachment).openUrl = getOpenUrlForReferenceAttachment(
            attachment.model
        );

        if (isFeatureEnabled('doc-unwrap-safelinks')) {
            (<ReferenceAttachmentModel>(
                attachment
            )).originalUrl = await getCloudyAttachmentOriginalUrl(attachment.model);
        }

        if (!isReadOnly) {
            const referenceAttachment = <ReferenceAttachment>attachment.model;
            const dataProviderInfo = getDataProviderInfo(referenceAttachment.ProviderType);
            if (
                dataProviderInfo?.requiresFetchingSharingInformation &&
                !isStringNullOrWhiteSpace(referenceAttachment.AttachLongPathName)
            ) {
                (<ReferenceAttachmentModel>attachment).requiresFetchingSharingInformation = true;
            }
        }
    }

    // Initialize thumbnail url
    if (shouldShowImageView(attachment.model)) {
        const id = attachment.id.Id;
        getAttachmentThumbnailUrl(attachment.id, attachment.model, isCloudy).then(
            action('updateAttachmentThumbnailUrl')(function updateAttachmentThumbnailUrl(
                url: string
            ) {
                if (getStore().attachments.has(id)) {
                    getStore().attachments.get(id).thumbnailImage.url = url;
                }
            }),
            e => {
                trace.warn(e);
            }
        );
    }
}
