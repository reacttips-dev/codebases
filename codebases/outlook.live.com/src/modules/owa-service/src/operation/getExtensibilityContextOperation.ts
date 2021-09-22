import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetExtensibilityContextParameters from '../contract/GetExtensibilityContextParameters';
import type ExtensibilityContext from '../contract/ExtensibilityContext';
import getExtensibilityContextParameters from '../factory/getExtensibilityContextParameters';

export default function getExtensibilityContextOperation(
    req: { request: GetExtensibilityContextParameters },
    options?: RequestOptions
): Promise<ExtensibilityContext> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = getExtensibilityContextParameters(req.request);
    }

    return makeServiceRequest<ExtensibilityContext>('GetExtensibilityContext', req, options);
}
