import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ItemId from '../contract/ItemId';
import type CalendarActionResponse from '../contract/CalendarActionResponse';
import itemId from '../factory/itemId';

export default function removeBirthdayEventOperation(
    req: ItemId,
    options?: RequestOptions
): Promise<CalendarActionResponse> {
    if (req !== undefined && !req['__type']) {
        req = itemId(req);
    }

    return makeServiceRequest<CalendarActionResponse>('RemoveBirthdayEvent', req, options);
}
