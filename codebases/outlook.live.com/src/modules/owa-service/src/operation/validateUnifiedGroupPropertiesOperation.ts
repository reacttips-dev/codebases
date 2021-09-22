import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ValidateUnifiedGroupPropertiesJsonRequest from '../contract/ValidateUnifiedGroupPropertiesJsonRequest';
import type ValidateUnifiedGroupPropertiesJsonResponse from '../contract/ValidateUnifiedGroupPropertiesJsonResponse';
import validateUnifiedGroupPropertiesJsonRequest from '../factory/validateUnifiedGroupPropertiesJsonRequest';

export default function validateUnifiedGroupPropertiesOperation(
    req: ValidateUnifiedGroupPropertiesJsonRequest,
    options?: RequestOptions
): Promise<ValidateUnifiedGroupPropertiesJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = validateUnifiedGroupPropertiesJsonRequest(req);
    }

    return makeServiceRequest<ValidateUnifiedGroupPropertiesJsonResponse>(
        'ValidateUnifiedGroupProperties',
        req,
        options
    );
}
