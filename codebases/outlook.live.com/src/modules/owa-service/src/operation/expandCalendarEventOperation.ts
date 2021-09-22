import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ExpandCalendarEventJsonRequest from '../contract/ExpandCalendarEventJsonRequest';
import type ExpandCalendarEventJsonResponse from '../contract/ExpandCalendarEventJsonResponse';
import expandCalendarEventJsonRequest from '../factory/expandCalendarEventJsonRequest';

export default function expandCalendarEventOperation(
    req: ExpandCalendarEventJsonRequest,
    options?: RequestOptions
): Promise<ExpandCalendarEventJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = expandCalendarEventJsonRequest(req);
    }

    return makeServiceRequest<ExpandCalendarEventJsonResponse>('ExpandCalendarEvent', req, options);
}
