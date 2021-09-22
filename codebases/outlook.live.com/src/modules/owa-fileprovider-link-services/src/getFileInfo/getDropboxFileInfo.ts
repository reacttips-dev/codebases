import { SharingLinkTypeView, TEXT_DIRECTORY_MIME_TYPE } from '../index';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import SharingLinkKind from 'owa-service/lib/contract/SharingLinkKind';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';
import type { GetDropboxSharingInfoResponse } from './GetDropboxSharingInfoResponse';

export async function getDropboxFileInfo(url: string): Promise<GetDropboxSharingInfoResponse> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.Dropbox);
    const requestBody = request.get_file_info_request.body;
    requestBody.url = url;

    const responseText: string = await getResponseFromFileProvider(
        request.providerType,
        request.get_file_info_request.requestUrlFormat,
        null, // additional headers
        request.get_file_info_request.method,
        JSON.stringify(requestBody),
        null, // original url
        request.get_file_info_request.dataPointName
    );
    const itemResponse = JSON.parse(responseText);

    return {
        ResultCode: AttachmentResultCode.Success,
        FileName: itemResponse.name,
        MimeType: itemResponse['.tag'] === 'folder' ? TEXT_DIRECTORY_MIME_TYPE : null,
        SharingLinkKind: SharingLinkKind.AnonymousView,
        BlocksDownload: !itemResponse.link_permissions.allow_download,
        CanShareExternally: true,
        ExpirationDate: null,
        OriginalUrl: null,
        Type: SharingLinkTypeView,
        providerFileId: itemResponse.id,
        location: url,
    };
}
