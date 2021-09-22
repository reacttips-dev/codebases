import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ApplyCategoryOperationRequest from '../contract/ApplyCategoryOperationRequest';
import type ApplyCategoryOperationResponse from '../contract/ApplyCategoryOperationResponse';
import applyCategoryOperationRequest from '../factory/applyCategoryOperationRequest';

export default function applyCategoryOperationOperation(
    req: { request: ApplyCategoryOperationRequest },
    options?: RequestOptions
): Promise<ApplyCategoryOperationResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = applyCategoryOperationRequest(req.request);
    }

    return makeServiceRequest<ApplyCategoryOperationResponse>(
        'ApplyCategoryOperation',
        req,
        options
    );
}
