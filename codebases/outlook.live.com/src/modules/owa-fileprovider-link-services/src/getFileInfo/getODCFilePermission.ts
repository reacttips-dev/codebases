import { getEncodedUrlForVroom } from 'owa-data-provider-info-fetcher';
import { HttpStatusCode } from 'owa-http-status-codes';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { format } from 'owa-localize';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';

export async function getODCFilePermission(url: string): Promise<ODCLinkPermission> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.OneDriveConsumer);
    const requestUrl = format(
        request.get_file_permission_request.requestUrlFormat,
        getEncodedUrlForVroom(url)
    );

    let info: GetODCFilePermissions;
    try {
        const responseText: string = await getResponseFromFileProvider(
            request.providerType,
            requestUrl,
            { Prefer: 'eventualconsistencyreadonly' }, // additional headers
            request.get_file_permission_request.method,
            null, // request body
            null, // original url
            request.get_file_permission_request.dataPointName
        );

        info = JSON.parse(responseText);
    } catch (error) {
        if (JSON.parse(error)?.responseStatus === HttpStatusCode.NotFound) {
            const responseText: string = await getResponseFromFileProvider(
                request.providerType,
                requestUrl,
                null, // additional headers
                request.get_file_permission_request.method,
                null, // request body
                null, // original url
                request.get_file_permission_request.dataPointName
            );

            info = JSON.parse(responseText);
        } else {
            throw error;
        }
    }

    let matchedLinkInfo: ODCLinkPermission;
    info.value.forEach(function (element: ODCLinkPermission) {
        if (!!element.link?.webUrl && url.indexOf(element.link?.webUrl) === 0) {
            matchedLinkInfo = element;
        }
    });
    if (!matchedLinkInfo) {
        throw new Error('GetODCSharingInfo failed to find the matching link');
    }
    return matchedLinkInfo;
}

interface GetODCFilePermissions {
    value: ODCLinkPermission[];
}
export interface ODCLinkPermission {
    expirationDateTime: string;
    id: string;
    link: ODCLink;
    shareId: string;
    invitation: Invitation;
}
interface ODCLink {
    type: string;
    webUrl: string;
}
interface Invitation {
    email: string;
    signInRequired: boolean;
}
