import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import getAttachmentDataProviderCreatorOperation from 'owa-service/lib/operation/getAttachmentDataProviderCreatorOperation';
import getAttachmentDataProviderCreatorRequest from 'owa-service/lib/factory/getAttachmentDataProviderCreatorRequest';
import type GetAttachmentDataProviderCreatorResponse from 'owa-service/lib/contract/GetAttachmentDataProviderCreatorResponse';

export default function getWopiFileProviderCreationInfo(
    providerType: AttachmentDataProviderType
): Promise<GetAttachmentDataProviderCreatorResponse> {
    const request = getAttachmentDataProviderCreatorRequest({
        ProviderType: providerType,
    });

    return getAttachmentDataProviderCreatorOperation(request);
}
