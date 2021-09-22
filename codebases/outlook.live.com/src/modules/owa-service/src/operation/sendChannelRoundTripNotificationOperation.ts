import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type ChannelRoundTripNotificationRequest from '../contract/ChannelRoundTripNotificationRequest';
import type ChannelRoundTripNotificationResponse from '../contract/ChannelRoundTripNotificationResponse';
import channelRoundTripNotificationRequest from '../factory/channelRoundTripNotificationRequest';

export default function sendChannelRoundTripNotificationOperation(
    req: ChannelRoundTripNotificationRequest,
    options?: RequestOptions
): Promise<ChannelRoundTripNotificationResponse> {
    if (req !== undefined && !req['__type']) {
        req = channelRoundTripNotificationRequest(req);
    }

    return makeServiceRequest<ChannelRoundTripNotificationResponse>(
        'SendChannelRoundTripNotification',
        req,
        options
    );
}
