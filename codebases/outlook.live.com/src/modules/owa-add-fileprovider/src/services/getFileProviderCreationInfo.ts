import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import getNewAttachmentDataProviderCreationInfoOperation from 'owa-service/lib/operation/getNewAttachmentDataProviderCreationInfoOperation';
import getNewAttachmentDataProviderCreationInfoRequest from 'owa-service/lib/factory/getNewAttachmentDataProviderCreationInfoRequest';
import type GetNewAttachmentDataProviderCreationInfoResponse from 'owa-service/lib/contract/GetNewAttachmentDataProviderCreationInfoResponse';

export default function getFileProviderCreationInfo(
    providerType: AttachmentDataProviderType
): Promise<GetNewAttachmentDataProviderCreationInfoResponse> {
    const request = getNewAttachmentDataProviderCreationInfoRequest({
        ProviderType: providerType,
    });

    return getNewAttachmentDataProviderCreationInfoOperation(request);
}
