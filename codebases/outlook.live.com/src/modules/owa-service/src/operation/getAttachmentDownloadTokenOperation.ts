import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';

export default function getAttachmentDownloadTokenOperation(
    options?: RequestOptions
): Promise<string> {
    return makeServiceRequest<string>('GetAttachmentDownloadToken', {}, options);
}
