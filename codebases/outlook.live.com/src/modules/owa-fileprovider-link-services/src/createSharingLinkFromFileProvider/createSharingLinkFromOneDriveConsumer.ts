import { isImageFile } from 'owa-file';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import { format } from 'owa-localize';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import { changeLinkPermissionOneDriveConsumer } from '../changeLinkPermission/changeLinkPermissionOneDriveConsumer';
import { SharingLinkTypeEdit, SharingLinkTypeView } from '../utils/constants';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';
import type { CreateSharingLinkFromFileProviderResult } from './CreateSharingLinkFromFileProviderResult';

export async function createSharingLinkFromOneDriveConsumer(
    fileProviderItemId: string,
    location: string
): Promise<CreateSharingLinkFromFileProviderResult> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.OneDriveConsumer);
    const requestUrl: string = format(
        request.create_shared_link_request.requestUrlFormat,
        fileProviderItemId
    );

    const isEdit: boolean = !isImageFile(location);
    if (isNullOrWhiteSpace(fileProviderItemId)) {
        return changeLinkPermissionOneDriveConsumer(
            location,
            isEdit
                ? AttachmentPermissionLevel.AnonymousEdit
                : AttachmentPermissionLevel.AnonymousView
        );
    }

    const requestBody = request.change_link_permission_request.body;
    requestBody.type = isEdit ? SharingLinkTypeEdit : SharingLinkTypeView;

    const responseText: string = await getResponseFromFileProvider(
        request.providerType,
        requestUrl,
        null, // additional headers
        request.create_shared_link_request.method,
        JSON.stringify(requestBody),
        null, // original url
        request.create_shared_link_request.dataPointName
    );

    return JSON.parse(responseText);
}
