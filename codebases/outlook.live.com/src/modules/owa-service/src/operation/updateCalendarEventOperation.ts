import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type UpdateCalendarEventJsonRequest from '../contract/UpdateCalendarEventJsonRequest';
import type UpdateItemJsonResponse from '../contract/UpdateItemJsonResponse';
import updateCalendarEventJsonRequest from '../factory/updateCalendarEventJsonRequest';

export default function updateCalendarEventOperation(
    req: UpdateCalendarEventJsonRequest,
    options?: RequestOptions
): Promise<UpdateItemJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = updateCalendarEventJsonRequest(req);
    }

    return makeServiceRequest<UpdateItemJsonResponse>('UpdateCalendarEvent', req, options);
}
