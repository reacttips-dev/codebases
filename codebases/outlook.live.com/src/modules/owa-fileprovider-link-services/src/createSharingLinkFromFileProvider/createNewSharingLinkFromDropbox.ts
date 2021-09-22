import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';

export async function createNewSharingLinkFromDropbox(filePath: string) {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.Dropbox);

    const requestBody = request.create_shared_link_request.body;
    requestBody.path = filePath;

    const responseText: string = await getResponseFromFileProvider(
        request.providerType,
        request.create_shared_link_request.requestUrlFormat,
        null, // additional headers
        request.create_shared_link_request.method,
        JSON.stringify(requestBody),
        null, // original url
        request.create_shared_link_request.dataPointName
    );

    return JSON.parse(responseText);
}
