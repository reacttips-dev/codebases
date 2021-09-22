import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type StartSearchSessionJsonRequest from '../contract/StartSearchSessionJsonRequest';
import type StartSearchSessionJsonResponse from '../contract/StartSearchSessionJsonResponse';
import startSearchSessionJsonRequest from '../factory/startSearchSessionJsonRequest';

export default function startSearchSessionOperation(
    req: StartSearchSessionJsonRequest,
    options?: RequestOptions
): Promise<StartSearchSessionJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = startSearchSessionJsonRequest(req);
    }

    return makeServiceRequest<StartSearchSessionJsonResponse>('StartSearchSession', req, options);
}
