import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetMailTipsJsonRequest from '../contract/GetMailTipsJsonRequest';
import type GetMailTipsJsonResponse from '../contract/GetMailTipsJsonResponse';
import getMailTipsJsonRequest from '../factory/getMailTipsJsonRequest';

export default function getMailTipsOperation(
    req: GetMailTipsJsonRequest,
    options?: RequestOptions
): Promise<GetMailTipsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getMailTipsJsonRequest(req);
    }

    return makeServiceRequest<GetMailTipsJsonResponse>('GetMailTips', req, options);
}
