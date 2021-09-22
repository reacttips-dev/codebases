import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type AddEventToMyCalendarRequest from '../contract/AddEventToMyCalendarRequest';
import type CalendarActionResponse from '../contract/CalendarActionResponse';
import addEventToMyCalendarRequest from '../factory/addEventToMyCalendarRequest';

export default function addEventToMyCalendarOperation(
    req: { request: AddEventToMyCalendarRequest },
    options?: RequestOptions
): Promise<CalendarActionResponse> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = addEventToMyCalendarRequest(req.request);
    }

    return makeServiceRequest<CalendarActionResponse>('AddEventToMyCalendar', req, options);
}
