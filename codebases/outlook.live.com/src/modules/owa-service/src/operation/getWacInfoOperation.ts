import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetWacInfoRequest from '../contract/GetWacInfoRequest';
import type WacAttachmentType from '../contract/WacAttachmentType';
import getWacInfoRequest from '../factory/getWacInfoRequest';

export default function getWacInfoOperation(
    req: { request: GetWacInfoRequest },
    options?: RequestOptions
): Promise<WacAttachmentType> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = getWacInfoRequest(req.request);
    }

    return makeServiceRequest<WacAttachmentType>('GetWacInfo', req, options);
}
