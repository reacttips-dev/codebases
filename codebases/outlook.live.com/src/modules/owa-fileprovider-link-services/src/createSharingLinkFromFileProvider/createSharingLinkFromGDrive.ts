import { SharingLinkScopeAnonymous, SharingLinkTypeEdit, SharingLinkTypeView } from '../index';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { format } from 'owa-localize';
import { getAnonymousPermissionType } from '../getFileInfo/getGDriveFileInfo';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';
import type {
    CreateSharingLinkFromFileProviderResult,
    SharingLinkFromFileProvider,
} from './CreateSharingLinkFromFileProviderResult';

async function getSharingLinkInfo(
    fileId: string
): Promise<CreateSharingLinkFromFileProviderResult> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.GDrive);
    const requestUrl = format(request.get_file_info_request.requestUrlFormat, fileId);

    const responseText: string = await getResponseFromFileProvider(
        request.providerType,
        requestUrl,
        null, // additional headers
        request.get_file_info_request.method,
        null, // request body
        null, // original url
        request.get_file_info_request.dataPointName
    );

    const itemResponse = JSON.parse(responseText);
    let sharingLinkFromFileProvider: SharingLinkFromFileProvider = {
        webUrl: itemResponse.webViewLink,
        type: null,
        scope: SharingLinkScopeAnonymous, // we only enable anonymous view/edit for GDrive links for the time being
    };
    if (itemResponse?.permissions) {
        const permissionType = getAnonymousPermissionType(itemResponse.permissions);
        if (permissionType === 'reader' || permissionType === 'writer') {
            sharingLinkFromFileProvider.type =
                permissionType === 'reader' ? SharingLinkTypeView : SharingLinkTypeEdit;
        }
    }
    return {
        expirationDateTime: null,
        shareId: itemResponse.id,
        link: sharingLinkFromFileProvider,
    };
}

export async function createSharingLinkFromGDrive(
    fileId: string
): Promise<CreateSharingLinkFromFileProviderResult> {
    // Try to retrieve the sharing link info. If it was created previously, simply return it.
    let sharingLinkInfo = await getSharingLinkInfo(fileId);
    // The sharing link has not been created yet, create a new sharing link with read only role by default.
    if (sharingLinkInfo.link.type == null) {
        const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.GDrive);
        const requestUrl: string = format(
            request.create_shared_link_request.requestUrlFormat,
            fileId
        );
        const requestBody = request.create_shared_link_request.body;
        requestBody.role = 'reader';

        const responseText: string = await getResponseFromFileProvider(
            request.providerType,
            requestUrl,
            null, // additional headers
            request.create_shared_link_request.method,
            JSON.stringify(requestBody), // request body
            null, // original url
            request.create_shared_link_request.dataPointName
        );

        const responseObject = JSON.parse(responseText);

        if (responseObject && responseObject.role === 'reader') {
            sharingLinkInfo.link.type = SharingLinkTypeView;
        }
    }
    return sharingLinkInfo;
}
