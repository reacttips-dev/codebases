import { SharingLinkTypeView, TEXT_DIRECTORY_MIME_TYPE } from '../index';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import SharingLinkKind from 'owa-service/lib/contract/SharingLinkKind';
import { format } from 'owa-localize';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';
import type { GetBoxSharingInfoResponse } from './GetBoxSharingInfoResponse';

export async function getBoxFileInfo(url: string): Promise<GetBoxSharingInfoResponse> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.Box);
    const requestUrl = request.get_file_info_request.requestUrlFormat;

    const additionalHeaders = JSON.parse(
        JSON.stringify(request.get_file_info_request.additional_headers)
    );
    additionalHeaders.BoxApi = format(additionalHeaders.BoxApi, url);

    const responseText: string = await getResponseFromFileProvider(
        request.providerType,
        requestUrl,
        additionalHeaders,
        request.get_file_info_request.method,
        null, // request body
        null, // original url
        request.get_file_info_request.dataPointName
    );

    const itemResponse = JSON.parse(responseText);

    return {
        ResultCode: AttachmentResultCode.Success,
        FileName: itemResponse.name,
        MimeType: itemResponse.type === 'folder' ? TEXT_DIRECTORY_MIME_TYPE : null,
        SharingLinkKind: SharingLinkKind.AnonymousView,
        BlocksDownload: !itemResponse.shared_link.permissions.can_download,
        CanShareExternally: true,
        ExpirationDate: null,
        OriginalUrl: null,
        Type: SharingLinkTypeView,
        providerFileId: itemResponse.id,
        location: url,
    };
}
