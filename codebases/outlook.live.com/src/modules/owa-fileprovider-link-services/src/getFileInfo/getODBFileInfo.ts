import { getEncodedUrlForVroom } from 'owa-data-provider-info-fetcher';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { format } from 'owa-localize';
import { trace } from 'owa-trace';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';
import type { GetSharingInfoResponseBase } from './GetSharingInfoResponseBase';

export async function getODBFileInfo(url: string): Promise<GetSharingInfoResponseBase> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.OneDrivePro);
    const parsedUrl: URL = new URL(url);
    const requestUrl = format(
        request.get_file_info_request.requestUrlFormat,
        parsedUrl.hostname,
        getEncodedUrlForVroom(url)
    );

    const responseText: string = await getResponseFromFileProvider(
        request.providerType,
        requestUrl,
        null, // additional headers
        request.get_file_info_request.method,
        null, // request body
        null, // original url
        request.get_file_info_request.dataPointName
    );
    trace.info(responseText);

    // VSTO: 60903 Move ODB GetSharingInfo to client
    return null;
}
