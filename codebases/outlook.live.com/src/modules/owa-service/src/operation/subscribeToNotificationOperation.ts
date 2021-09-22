import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type NotificationSubscribeJsonRequest from '../contract/NotificationSubscribeJsonRequest';
import type SubscriptionData from '../contract/SubscriptionData';
import type SubscriptionResponseData from '../contract/SubscriptionResponseData';
import notificationSubscribeJsonRequest from '../factory/notificationSubscribeJsonRequest';
import subscriptionData from '../factory/subscriptionData';

export default function subscribeToNotificationOperation(
    req: { request: NotificationSubscribeJsonRequest; subscriptionData: SubscriptionData[] },
    options?: RequestOptions
): Promise<SubscriptionResponseData[]> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = notificationSubscribeJsonRequest(req.request);
    }

    if (req.subscriptionData !== undefined) {
        for (var i = 0; i < req.subscriptionData.length; i++) {
            if (req.subscriptionData[i] !== undefined && !req.subscriptionData[i]['__type']) {
                req.subscriptionData[i] = subscriptionData(req.subscriptionData[i]);
            }
        }
    }

    return makeServiceRequest<SubscriptionResponseData[]>('SubscribeToNotification', req, options);
}
