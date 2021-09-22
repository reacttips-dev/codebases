import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetRemindersJsonRequest from '../contract/GetRemindersJsonRequest';
import type GetRemindersJsonResponse from '../contract/GetRemindersJsonResponse';
import getRemindersJsonRequest from '../factory/getRemindersJsonRequest';

export default function getRemindersOperation(
    req: GetRemindersJsonRequest,
    options?: RequestOptions
): Promise<GetRemindersJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getRemindersJsonRequest(req);
    }

    return makeServiceRequest<GetRemindersJsonResponse>('GetReminders', req, options);
}
