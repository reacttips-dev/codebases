import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SaveExtensionSettingsParameters from '../contract/SaveExtensionSettingsParameters';
import type SaveExtensionSettingsResponse from '../contract/SaveExtensionSettingsResponse';
import saveExtensionSettingsParameters from '../factory/saveExtensionSettingsParameters';

export default function saveExtensionSettingsOperation(
    req: { request: SaveExtensionSettingsParameters },
    options?: RequestOptions
): Promise<SaveExtensionSettingsResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = saveExtensionSettingsParameters(req.request);
    }

    return makeServiceRequest<SaveExtensionSettingsResponse>('SaveExtensionSettings', req, options);
}
