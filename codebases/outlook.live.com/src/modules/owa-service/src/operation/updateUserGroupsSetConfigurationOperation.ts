import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type UpdateUserGroupsSetConfigurationRequest from '../contract/UpdateUserGroupsSetConfigurationRequest';
import type UpdateUserConfigurationResponse from '../contract/UpdateUserConfigurationResponse';
import updateUserGroupsSetConfigurationRequest from '../factory/updateUserGroupsSetConfigurationRequest';

export default function updateUserGroupsSetConfigurationOperation(
    req: { request: UpdateUserGroupsSetConfigurationRequest },
    options?: RequestOptions
): Promise<UpdateUserConfigurationResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = updateUserGroupsSetConfigurationRequest(req.request);
    }

    return makeServiceRequest<UpdateUserConfigurationResponse>(
        'UpdateUserGroupsSetConfiguration',
        req,
        options
    );
}
