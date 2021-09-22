import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetAttachmentTextPreviewRequest from '../contract/GetAttachmentTextPreviewRequest';
import type GetAttachmentTextPreviewResponse from '../contract/GetAttachmentTextPreviewResponse';
import getAttachmentTextPreviewRequest from '../factory/getAttachmentTextPreviewRequest';

export default function getAttachmentTextPreviewOperation(
    req: GetAttachmentTextPreviewRequest,
    options?: RequestOptions
): Promise<GetAttachmentTextPreviewResponse> {
    if (req !== undefined && !req['__type']) {
        req = getAttachmentTextPreviewRequest(req);
    }

    return makeServiceRequest<GetAttachmentTextPreviewResponse>(
        'GetAttachmentTextPreview',
        req,
        options
    );
}
