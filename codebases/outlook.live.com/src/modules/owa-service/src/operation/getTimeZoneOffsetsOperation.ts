import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetTimeZoneOffsetsJsonRequest from '../contract/GetTimeZoneOffsetsJsonRequest';
import type GetTimeZoneOffsetsJsonResponse from '../contract/GetTimeZoneOffsetsJsonResponse';
import getTimeZoneOffsetsJsonRequest from '../factory/getTimeZoneOffsetsJsonRequest';

export default function getTimeZoneOffsetsOperation(
    req: GetTimeZoneOffsetsJsonRequest,
    options?: RequestOptions
): Promise<GetTimeZoneOffsetsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getTimeZoneOffsetsJsonRequest(req);
    }

    return makeServiceRequest<GetTimeZoneOffsetsJsonResponse>('GetTimeZoneOffsets', req, options);
}
