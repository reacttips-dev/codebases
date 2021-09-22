import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import { format } from 'owa-localize';
import { getItemIdFromGDriveUrl } from '../getFileInfo/getGDriveFileInfo';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';

export async function changeLinkPermissionGDrive(
    originalUrl: string,
    newPermissionLevel: AttachmentPermissionLevel
): Promise<void> {
    switch (newPermissionLevel) {
        case AttachmentPermissionLevel.AnonymousEdit:
        case AttachmentPermissionLevel.AnonymousView:
            break;
        default:
            throw new Error(
                `We do not support this permission level for GDrive: ${newPermissionLevel}`
            );
    }

    const itemId: string = getItemIdFromGDriveUrl(originalUrl);
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.GDrive);
    const requestUrl: string = format(
        request.change_link_permission_request.requestUrlFormat,
        itemId,
        'anyoneWithLink'
    );

    const requestBody = request.change_link_permission_request.body;
    const newRole: string =
        newPermissionLevel === AttachmentPermissionLevel.AnonymousEdit ? 'writer' : 'reader';
    requestBody.role = newRole;

    await getResponseFromFileProvider(
        request.providerType,
        requestUrl,
        null, // additional headers
        request.change_link_permission_request.method,
        JSON.stringify(requestBody),
        null, // original url
        request.change_link_permission_request.dataPointName
    );
}
