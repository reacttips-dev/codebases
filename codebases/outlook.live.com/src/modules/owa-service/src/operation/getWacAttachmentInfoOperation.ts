import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type WacAttachmentType from '../contract/WacAttachmentType';

export default function getWacAttachmentInfoOperation(
    req: { attachmentId: string; isEdit: boolean; draftId: string; appId: string },
    options?: RequestOptions
): Promise<WacAttachmentType> {
    return makeServiceRequest<WacAttachmentType>('GetWacAttachmentInfo', req, options);
}
