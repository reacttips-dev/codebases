import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type UpdateClientExtensionNotificationsJsonRequest from '../contract/UpdateClientExtensionNotificationsJsonRequest';
import type UpdateClientExtensionNotificationsJsonResponse from '../contract/UpdateClientExtensionNotificationsJsonResponse';
import updateClientExtensionNotificationsJsonRequest from '../factory/updateClientExtensionNotificationsJsonRequest';

export default function updateClientExtensionNotificationsOperation(
    req: UpdateClientExtensionNotificationsJsonRequest,
    options?: RequestOptions
): Promise<UpdateClientExtensionNotificationsJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = updateClientExtensionNotificationsJsonRequest(req);
    }

    return makeServiceRequest<UpdateClientExtensionNotificationsJsonResponse>(
        'UpdateClientExtensionNotifications',
        req,
        options
    );
}
