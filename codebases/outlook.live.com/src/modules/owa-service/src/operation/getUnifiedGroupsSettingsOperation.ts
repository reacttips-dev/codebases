import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetUnifiedGroupsSettingsJsonRequest from '../contract/GetUnifiedGroupsSettingsJsonRequest';
import type GetUnifiedGroupsSettingsJsonResponse from '../contract/GetUnifiedGroupsSettingsJsonResponse';
import getUnifiedGroupsSettingsJsonRequest from '../factory/getUnifiedGroupsSettingsJsonRequest';

export default function getUnifiedGroupsSettingsOperation(
    req: GetUnifiedGroupsSettingsJsonRequest,
    options?: RequestOptions
): Promise<GetUnifiedGroupsSettingsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getUnifiedGroupsSettingsJsonRequest(req);
    }

    return makeServiceRequest<GetUnifiedGroupsSettingsJsonResponse>(
        'GetUnifiedGroupsSettings',
        req,
        options
    );
}
