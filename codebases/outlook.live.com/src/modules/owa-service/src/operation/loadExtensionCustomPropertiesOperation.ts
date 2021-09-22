import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type LoadExtensionCustomPropertiesParameters from '../contract/LoadExtensionCustomPropertiesParameters';
import type LoadExtensionCustomPropertiesResponse from '../contract/LoadExtensionCustomPropertiesResponse';
import loadExtensionCustomPropertiesParameters from '../factory/loadExtensionCustomPropertiesParameters';

export default function loadExtensionCustomPropertiesOperation(
    req: { request: LoadExtensionCustomPropertiesParameters },
    options?: RequestOptions
): Promise<LoadExtensionCustomPropertiesResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = loadExtensionCustomPropertiesParameters(req.request);
    }

    return makeServiceRequest<LoadExtensionCustomPropertiesResponse>(
        'LoadExtensionCustomProperties',
        req,
        options
    );
}
