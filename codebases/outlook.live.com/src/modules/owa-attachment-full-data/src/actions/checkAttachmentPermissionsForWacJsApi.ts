import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import disableWacPreview from 'owa-attachment-data/lib/actions/disableWacPreview';
import type { AttachmentModel, ReferenceAttachmentModel } from 'owa-attachment-model-store';
import getCloudyAttachmentOriginalUrl from 'owa-attachment-model-store/lib/utils/getCloudyAttachmentOriginalUrl';
import getWacInfoForOneDriveJsApi from 'owa-attachment-wac/lib/services/getWacInfoForOneDriveJsApi';
import { isFeatureEnabled } from 'owa-feature-flags';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

/**
 * Prefetches WAC info and blocks preview if the attachment can't be opened due to data provider issues.
 * @param attachmentModel is the attachment model for the attachment being evaluated
 * @param attachmentViewState is the view state for the attachment being evaluated
 */
export default async function checkAttachmentPermissionsForWacJsApi(
    attachmentModel: AttachmentModel,
    attachmentViewState: AttachmentFullViewState
) {
    const referenceAttachmentModel: ReferenceAttachmentModel = attachmentModel as ReferenceAttachmentModel;

    const openUrl: string = isFeatureEnabled('doc-unwrap-safelinks')
        ? await getCloudyAttachmentOriginalUrl(attachmentModel.model) // This is a property in the attachment model, but it's fetched async so might not be populated in the model when this function runs
        : referenceAttachmentModel.openUrl;

    const result = await getWacInfoForOneDriveJsApi(
        AttachmentDataProviderType.OneDrivePro,
        openUrl,
        false /* isEdit */,
        false /* redeemSharingLinkIfNecessary - this is not used in prefetch */,
        true /* returnEvenIfNoWacInfo - needed to differentiate between permissions issues and lack of sharing link redemption */
    );

    if (!result) {
        disableWacPreview(attachmentViewState.strategy);
    }
}
