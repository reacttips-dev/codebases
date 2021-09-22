import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ConvertRefToLocalAttachmentRequest from '../contract/ConvertRefToLocalAttachmentRequest';
import convertRefToLocalAttachmentRequest from '../factory/convertRefToLocalAttachmentRequest';

export default function convertRefToLocalAttachmentOperation(
    req: { requestObject: ConvertRefToLocalAttachmentRequest },
    options?: RequestOptions
): Promise<string> {
    if (req.requestObject !== undefined && !req.requestObject['__type']) {
        req.requestObject = convertRefToLocalAttachmentRequest(req.requestObject);
    }

    return makeServiceRequest<string>('ConvertRefToLocalAttachment', req, options);
}
