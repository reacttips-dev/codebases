import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ConvertLocalToRefAttachmentRequest from '../contract/ConvertLocalToRefAttachmentRequest';
import convertLocalToRefAttachmentRequest from '../factory/convertLocalToRefAttachmentRequest';

export default function convertLocalToRefAttachmentOperation(
    req: { requestObject: ConvertLocalToRefAttachmentRequest },
    options?: RequestOptions
): Promise<string> {
    if (req.requestObject !== undefined && !req.requestObject['__type']) {
        req.requestObject = convertLocalToRefAttachmentRequest(req.requestObject);
    }

    return makeServiceRequest<string>('ConvertLocalToRefAttachment', req, options);
}
