import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type CancelConvertRefToLocalAttachmentRequest from '../contract/CancelConvertRefToLocalAttachmentRequest';
import cancelConvertRefToLocalAttachmentRequest from '../factory/cancelConvertRefToLocalAttachmentRequest';

export default function cancelConvertRefToLocalAttachmentOperation(
    req: CancelConvertRefToLocalAttachmentRequest,
    options?: RequestOptions
): Promise<boolean> {
    if (req !== undefined && !req['__type']) {
        req = cancelConvertRefToLocalAttachmentRequest(req);
    }

    return makeServiceRequest<boolean>('CancelConvertRefToLocalAttachment', req, options);
}
