import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type DeleteCalendarEventJsonRequest from '../contract/DeleteCalendarEventJsonRequest';
import type DeleteCalendarEventJsonResponse from '../contract/DeleteCalendarEventJsonResponse';
import deleteCalendarEventJsonRequest from '../factory/deleteCalendarEventJsonRequest';

export default function deleteCalendarEventOperation(
    req: DeleteCalendarEventJsonRequest,
    options?: RequestOptions
): Promise<DeleteCalendarEventJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = deleteCalendarEventJsonRequest(req);
    }

    return makeServiceRequest<DeleteCalendarEventJsonResponse>('DeleteCalendarEvent', req, options);
}
