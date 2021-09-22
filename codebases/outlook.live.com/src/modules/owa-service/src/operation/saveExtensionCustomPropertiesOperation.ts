import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SaveExtensionCustomPropertiesParameters from '../contract/SaveExtensionCustomPropertiesParameters';
import type SaveExtensionCustomPropertiesResponse from '../contract/SaveExtensionCustomPropertiesResponse';
import saveExtensionCustomPropertiesParameters from '../factory/saveExtensionCustomPropertiesParameters';

export default function saveExtensionCustomPropertiesOperation(
    req: { request: SaveExtensionCustomPropertiesParameters },
    options?: RequestOptions
): Promise<SaveExtensionCustomPropertiesResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = saveExtensionCustomPropertiesParameters(req.request);
    }

    return makeServiceRequest<SaveExtensionCustomPropertiesResponse>(
        'SaveExtensionCustomProperties',
        req,
        options
    );
}
