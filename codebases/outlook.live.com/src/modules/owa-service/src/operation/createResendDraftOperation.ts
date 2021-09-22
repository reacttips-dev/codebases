import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';

export default function createResendDraftOperation(
    req: { ndrMessageId: string; draftsFolderId: string },
    options?: RequestOptions
): Promise<string> {
    return makeServiceRequest<string>('CreateResendDraft', req, options);
}
