import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type CancelConvertLocalToRefAttachmentRequest from '../contract/CancelConvertLocalToRefAttachmentRequest';
import cancelConvertLocalToRefAttachmentRequest from '../factory/cancelConvertLocalToRefAttachmentRequest';

export default function cancelConvertLocalToRefAttachmentOperation(
    req: CancelConvertLocalToRefAttachmentRequest,
    options?: RequestOptions
): Promise<boolean> {
    if (req !== undefined && !req['__type']) {
        req = cancelConvertLocalToRefAttachmentRequest(req);
    }

    return makeServiceRequest<boolean>('CancelConvertLocalToRefAttachment', req, options);
}
