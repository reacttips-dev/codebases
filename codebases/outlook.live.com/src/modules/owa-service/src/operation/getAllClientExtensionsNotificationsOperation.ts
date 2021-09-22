import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetAllClientExtensionsNotificationsJsonRequest from '../contract/GetAllClientExtensionsNotificationsJsonRequest';
import type GetAllClientExtensionsNotificationsJsonResponse from '../contract/GetAllClientExtensionsNotificationsJsonResponse';
import getAllClientExtensionsNotificationsJsonRequest from '../factory/getAllClientExtensionsNotificationsJsonRequest';

export default function getAllClientExtensionsNotificationsOperation(
    req: GetAllClientExtensionsNotificationsJsonRequest,
    options?: RequestOptions
): Promise<GetAllClientExtensionsNotificationsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getAllClientExtensionsNotificationsJsonRequest(req);
    }

    return makeServiceRequest<GetAllClientExtensionsNotificationsJsonResponse>(
        'GetAllClientExtensionsNotifications',
        req,
        options
    );
}
