import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetFolderChangeDigestRequest from '../contract/GetFolderChangeDigestRequest';
import type GetFolderChangeDigestResponse from '../contract/GetFolderChangeDigestResponse';
import getFolderChangeDigestRequest from '../factory/getFolderChangeDigestRequest';

export default function getFolderChangeDigestOperation(
    req: GetFolderChangeDigestRequest,
    options?: RequestOptions
): Promise<GetFolderChangeDigestResponse> {
    if (req !== undefined && !req['__type']) {
        req = getFolderChangeDigestRequest(req);
    }

    return makeServiceRequest<GetFolderChangeDigestResponse>('GetFolderChangeDigest', req, options);
}
