import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type SubscriptionData from '../contract/SubscriptionData';
import subscriptionData from '../factory/subscriptionData';

export default function unsubscribeToNotificationOperation(
    req: { subscriptionData: SubscriptionData[] },
    options?: RequestOptions
): Promise<boolean> {
    if (req.subscriptionData !== undefined) {
        for (var i = 0; i < req.subscriptionData.length; i++) {
            if (req.subscriptionData[i] !== undefined && !req.subscriptionData[i]['__type']) {
                req.subscriptionData[i] = subscriptionData(req.subscriptionData[i]);
            }
        }
    }

    return makeServiceRequest<boolean>('UnsubscribeToNotification', req, options);
}
