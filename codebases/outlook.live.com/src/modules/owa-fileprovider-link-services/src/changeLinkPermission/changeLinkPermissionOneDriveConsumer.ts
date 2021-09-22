import { getEncodedUrlForVroom } from 'owa-data-provider-info-fetcher';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import { format } from 'owa-localize';
import type { CreateSharingLinkFromFileProviderResult } from '../createSharingLinkFromFileProvider/CreateSharingLinkFromFileProviderResult';
import { SharingLinkTypeEdit, SharingLinkTypeView } from '../utils/constants';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';

export async function changeLinkPermissionOneDriveConsumer(
    originalUrl: string,
    newPermissionLevel: AttachmentPermissionLevel
): Promise<CreateSharingLinkFromFileProviderResult> {
    switch (newPermissionLevel) {
        case AttachmentPermissionLevel.AnonymousEdit:
        case AttachmentPermissionLevel.AnonymousView:
            break;
        default:
            throw new Error(
                `OneDriveConsumer does not support this permission level: ${newPermissionLevel}`
            );
    }

    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.OneDriveConsumer);

    const requestUrl: string = format(
        request.change_link_permission_request.requestUrlFormat,
        getEncodedUrlForVroom(originalUrl)
    );

    const requestBody = request.change_link_permission_request.body;
    requestBody.type =
        newPermissionLevel === AttachmentPermissionLevel.AnonymousEdit
            ? SharingLinkTypeEdit
            : SharingLinkTypeView;

    const responseText: string = await getResponseFromFileProvider(
        request.providerType,
        requestUrl,
        null, // additional headers
        request.change_link_permission_request.method,
        JSON.stringify(requestBody),
        null, // original url
        request.change_link_permission_request.dataPointName
    );

    return JSON.parse(responseText);
}
