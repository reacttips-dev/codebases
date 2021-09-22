import { SharingLinkTypeEdit, SharingLinkTypeView, TEXT_DIRECTORY_MIME_TYPE } from '../index';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import SharingLinkKind from 'owa-service/lib/contract/SharingLinkKind';
import { format } from 'owa-localize';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';
import type { GetGDriveSharingInfoResponse } from './GetGDriveSharingInfoResponse';

function getFileIdFromUrl(url: string): string {
    const matchArray = url.match(/\/d\/(.+)\//gm);

    if (!matchArray || matchArray.length > 1) {
        return '';
    }

    const res: string = matchArray[0];
    return res.substring(3).replace('/', ''); // skip "/d/" and trim "/" in the end
}

function getFolderIdFromUrl(url: string): string {
    const matchArray = url.match(/\/folders\/(.+)$/gm);

    if (!matchArray || matchArray.length > 1) {
        return '';
    }

    const res: string = matchArray[0];
    return res.substring(9); // skip "/folders/"
}

export function getItemIdFromGDriveUrl(url: string): string {
    let itemId: string = getFileIdFromUrl(url);
    if (isNullOrWhiteSpace(itemId)) {
        itemId = getFolderIdFromUrl(url);
    }
    return itemId;
}

export function getAnonymousPermissionType(permissions: any[]): string | null {
    if (permissions) {
        for (const permission of permissions) {
            if (permission.id === 'anyoneWithLink') {
                return permission.role; // possible values: "reader", "writer", "commenter"
            }
        }
    }
    return null;
}

async function getGDriveFileInfoResponseById(fileId: string): Promise<any> {
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
    return itemResponse;
}

export async function getGDriveFileInfo(url: string): Promise<GetGDriveSharingInfoResponse | null> {
    const fileId: string = getItemIdFromGDriveUrl(url);
    const itemResponse = await getGDriveFileInfoResponseById(fileId);

    if (
        !itemResponse ||
        !itemResponse.permissionIds ||
        itemResponse.permissionIds.indexOf('anyoneWithLink') === -1
    ) {
        return null;
    }

    let sharingLinkType = null;
    let sharingLinkKind = SharingLinkKind.Uninitialized;
    const permissionType = getAnonymousPermissionType(itemResponse.permissions);
    if (permissionType === 'reader') {
        sharingLinkType = SharingLinkTypeView;
        sharingLinkKind = SharingLinkKind.AnonymousView;
    } else if (permissionType === 'writer') {
        sharingLinkType = SharingLinkTypeEdit;
        sharingLinkKind = SharingLinkKind.AnonymousEdit;
    }

    return {
        ResultCode: AttachmentResultCode.Success,
        FileName: itemResponse.name,
        MimeType:
            itemResponse.mimeType === 'application/vnd.google-apps.folder'
                ? TEXT_DIRECTORY_MIME_TYPE
                : itemResponse.mimeType,
        SharingLinkKind: sharingLinkKind,
        BlocksDownload: itemResponse.capabilities.canDownload,
        CanShareExternally: true,
        CanCreateAnonymousEditLink: true,
        CanCreateAnonymousViewLink: true,
        ExpirationDate: null,
        OriginalUrl: null,
        Type: sharingLinkType,
        providerFileId: itemResponse.id,
    };
}
