import { CORS_MODE_NAME, FetchRequestOptions, fetchService } from 'owa-data-provider-info-fetcher';
import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

export function getResponseFromFileProvider(
    attachmentDataProviderType: AttachmentDataProviderType,
    requestUrl: string,
    additionalHeaders: object,
    requestMethod: string,
    requestBody: string,
    originalUrl: string,
    dataPointName: string
): Promise<string> {
    const requestOptions: FetchRequestOptions = {
        method: requestMethod,
        mode: CORS_MODE_NAME,
        body: requestBody,
        datapointNamePrefix: dataPointName,
    };

    return fetchService(
        attachmentDataProviderType,
        requestUrl,
        originalUrl,
        requestOptions,
        additionalHeaders
    );
}
