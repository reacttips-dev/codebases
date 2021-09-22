import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type UpdateUserConfigurationJsonRequest from '../contract/UpdateUserConfigurationJsonRequest';
import type UpdateUserConfigurationJsonResponse from '../contract/UpdateUserConfigurationJsonResponse';
import updateUserConfigurationJsonRequest from '../factory/updateUserConfigurationJsonRequest';

export default function updateUserConfigurationOperation(
    req: UpdateUserConfigurationJsonRequest,
    options?: RequestOptions
): Promise<UpdateUserConfigurationJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = updateUserConfigurationJsonRequest(req);
    }

    return makeServiceRequest<UpdateUserConfigurationJsonResponse>(
        'UpdateUserConfiguration',
        req,
        options
    );
}
