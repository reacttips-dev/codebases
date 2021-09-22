import { getEncodedUrlForVroom } from 'owa-data-provider-info-fetcher';
import { HttpStatusCode } from 'owa-http-status-codes';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { format } from 'owa-localize';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';

export async function getODCDriveItem(url: string): Promise<GetODCDriveItemResponse> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.OneDriveConsumer);
    const requestUrl = format(
        request.get_drive_item_request.requestUrlFormat,
        getEncodedUrlForVroom(url)
    );

    try {
        const responseText: string = await getResponseFromFileProvider(
            request.providerType,
            requestUrl,
            { Prefer: 'eventualconsistencyreadonly' }, // additional headers
            request.get_drive_item_request.method,
            null, // request body
            null, // original url
            request.get_drive_item_request.dataPointName
        );

        return JSON.parse(responseText);
    } catch (error) {
        if (JSON.parse(error)?.responseStatus === HttpStatusCode.NotFound) {
            const responseText: string = await getResponseFromFileProvider(
                request.providerType,
                requestUrl,
                null, // additional headers
                request.get_drive_item_request.method,
                null, // request body
                null, // original url
                request.get_drive_item_request.dataPointName
            );

            return JSON.parse(responseText);
        } else {
            throw error;
        }
    }
}

export interface GetODCDriveItemResponse {
    id: string;
    name: string;
    file: ODCFile;
    webDavUrl: string;
}

interface ODCFile {
    mimeType: string;
}
