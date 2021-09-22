import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';

export default function connectedAccountsNotificationOperation(
    req: { isOWALogon: boolean },
    options?: RequestOptions
): Promise<boolean> {
    return makeServiceRequest<boolean>('ConnectedAccountsNotification', req, options);
}
