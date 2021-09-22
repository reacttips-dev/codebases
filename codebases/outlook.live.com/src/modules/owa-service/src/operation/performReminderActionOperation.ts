import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type PerformReminderActionJsonRequest from '../contract/PerformReminderActionJsonRequest';
import type PerformReminderActionJsonResponse from '../contract/PerformReminderActionJsonResponse';
import performReminderActionJsonRequest from '../factory/performReminderActionJsonRequest';

export default function performReminderActionOperation(
    req: PerformReminderActionJsonRequest,
    options?: RequestOptions
): Promise<PerformReminderActionJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = performReminderActionJsonRequest(req);
    }

    return makeServiceRequest<PerformReminderActionJsonResponse>(
        'PerformReminderAction',
        req,
        options
    );
}
