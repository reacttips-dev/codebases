import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetAttachmentPreviewsRequest from '../contract/GetAttachmentPreviewsRequest';
import type GetAttachmentPreviewsResponse from '../contract/GetAttachmentPreviewsResponse';
import getAttachmentPreviewsRequest from '../factory/getAttachmentPreviewsRequest';

export default function getAttachmentPreviewsOperation(
    req: GetAttachmentPreviewsRequest,
    options?: RequestOptions
): Promise<GetAttachmentPreviewsResponse> {
    if (req !== undefined && !req['__type']) {
        req = getAttachmentPreviewsRequest(req);
    }

    return makeServiceRequest<GetAttachmentPreviewsResponse>('GetAttachmentPreviews', req, options);
}
