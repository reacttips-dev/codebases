import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type WacAttachmentType from 'owa-service/lib/contract/WacAttachmentType';
import getWacInfoOperation from 'owa-service/lib/operation/getWacInfoOperation';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export default function getWacInfo(
    url: string,
    providerType: AttachmentDataProviderType,
    shouldGrantAccess: boolean = false,
    isEdit: boolean = false,
    options?: RequestOptions
): Promise<WacAttachmentType> {
    return getWacInfoOperation(
        {
            request: {
                Url: url,
                IsEdit: isEdit,
                ProviderType: providerType,
                ShouldGrantAccess: shouldGrantAccess,
            },
        },
        options
    );
}
