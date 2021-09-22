import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type TimeZoneConfiguration from '../contract/TimeZoneConfiguration';

export default function getTimeZoneOperation(
    req: { needTimeZoneList: boolean },
    options?: RequestOptions
): Promise<TimeZoneConfiguration> {
    return makeServiceRequest<TimeZoneConfiguration>('GetTimeZone', req, options);
}
