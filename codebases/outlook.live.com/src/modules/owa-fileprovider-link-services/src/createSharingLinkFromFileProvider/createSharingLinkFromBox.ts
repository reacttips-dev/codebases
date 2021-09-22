import { SharingLinkScopeAnonymous, SharingLinkTypeView } from '../index';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { format } from 'owa-localize';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';
import type {
    CreateSharingLinkFromFileProviderResult,
    SharingLinkFromFileProvider,
} from './CreateSharingLinkFromFileProviderResult';

export async function createSharingLinkFromBox(
    fileId: string,
    isFolder: boolean
): Promise<CreateSharingLinkFromFileProviderResult> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.Box);
    const fileType: string = isFolder ? 'folders' : 'files';
    const requestUrl: string = format(
        request.create_shared_link_request.requestUrlFormat,
        fileType,
        fileId
    );

    const responseText: string = await getResponseFromFileProvider(
        request.providerType,
        requestUrl,
        null, // additional headers,
        request.create_shared_link_request.method,
        JSON.stringify(request.create_shared_link_request.body),
        null, // original url
        request.create_shared_link_request.dataPointName
    );

    const responseObject = JSON.parse(responseText);

    const sharingLinkFromFileProvider: SharingLinkFromFileProvider = {
        webUrl: responseObject.shared_link.url,
        type: SharingLinkTypeView,
        scope: SharingLinkScopeAnonymous,
    };
    return {
        expirationDateTime: null,
        shareId: responseObject.id,
        link: sharingLinkFromFileProvider,
    };
}
