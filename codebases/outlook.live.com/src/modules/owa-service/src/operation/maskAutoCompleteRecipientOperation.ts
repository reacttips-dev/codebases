import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type MaskAutoCompleteRecipientRequest from '../contract/MaskAutoCompleteRecipientRequest';
import type MaskAutoCompleteRecipientResponse from '../contract/MaskAutoCompleteRecipientResponse';
import maskAutoCompleteRecipientRequest from '../factory/maskAutoCompleteRecipientRequest';

export default function maskAutoCompleteRecipientOperation(
    req: MaskAutoCompleteRecipientRequest,
    options?: RequestOptions
): Promise<MaskAutoCompleteRecipientResponse> {
    if (req !== undefined && !req['__type']) {
        req = maskAutoCompleteRecipientRequest(req);
    }

    return makeServiceRequest<MaskAutoCompleteRecipientResponse>(
        'MaskAutoCompleteRecipient',
        req,
        options
    );
}
