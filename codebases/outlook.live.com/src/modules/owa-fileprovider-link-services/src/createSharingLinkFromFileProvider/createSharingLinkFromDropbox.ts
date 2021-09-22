import { SharingLinkScopeAnonymous, SharingLinkTypeView } from '../index';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';
import { createNewSharingLinkFromDropbox } from './createNewSharingLinkFromDropbox';
import type {
    CreateSharingLinkFromFileProviderResult,
    SharingLinkFromFileProvider,
} from './CreateSharingLinkFromFileProviderResult';

export async function createSharingLinkFromDropbox(
    filePath: string
): Promise<CreateSharingLinkFromFileProviderResult> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.Dropbox);
    const requestBody = request.get_shared_link_request.body;
    requestBody.path = filePath;

    const responseText: string = await getResponseFromFileProvider(
        request.providerType,
        request.get_shared_link_request.requestUrlFormat,
        null, // additional headers
        request.get_shared_link_request.method,
        JSON.stringify(requestBody),
        null, // original url
        request.get_shared_link_request.dataPointName
    );

    let responseObject = JSON.parse(responseText).links[0];

    // If the shared link has not ever been created before, we need to create one
    if (!responseObject) {
        responseObject = await createNewSharingLinkFromDropbox(filePath);
    }

    const sharingLinkFromFileProvider: SharingLinkFromFileProvider = {
        webUrl: responseObject.url,
        type: SharingLinkTypeView, // only the owner can edit
        scope: SharingLinkScopeAnonymous,
    };
    return {
        expirationDateTime: null,
        shareId: responseObject.id,
        link: sharingLinkFromFileProvider,
    };
}
