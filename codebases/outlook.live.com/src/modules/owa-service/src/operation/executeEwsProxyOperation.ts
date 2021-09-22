import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type EwsProxyRequestParameters from '../contract/EwsProxyRequestParameters';
import type EwsProxyResponse from '../contract/EwsProxyResponse';
import ewsProxyRequestParameters from '../factory/ewsProxyRequestParameters';

export default function executeEwsProxyOperation(
    req: EwsProxyRequestParameters,
    options?: RequestOptions
): Promise<EwsProxyResponse> {
    if (req !== undefined && !req['__type']) {
        req = ewsProxyRequestParameters(req);
    }

    return makeServiceRequest<EwsProxyResponse>('ExecuteEwsProxy', req, options);
}
