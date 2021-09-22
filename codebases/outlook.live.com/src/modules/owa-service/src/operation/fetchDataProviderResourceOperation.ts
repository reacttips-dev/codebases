import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type FetchDataProviderResourceRequest from '../contract/FetchDataProviderResourceRequest';
import type FetchDataProviderResourceResponse from '../contract/FetchDataProviderResourceResponse';
import fetchDataProviderResourceRequest from '../factory/fetchDataProviderResourceRequest';

export default function fetchDataProviderResourceOperation(
    req: FetchDataProviderResourceRequest,
    options?: RequestOptions
): Promise<FetchDataProviderResourceResponse> {
    if (req !== undefined && !req['__type']) {
        req = fetchDataProviderResourceRequest(req);
    }

    return makeServiceRequest<FetchDataProviderResourceResponse>(
        'FetchDataProviderResource',
        req,
        options
    );
}
