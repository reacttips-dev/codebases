import { getApolloClient } from 'owa-apollo';
import type * as Schema from 'owa-graph-schema';
import { SubscribeToNotificationChannelReadyDocument } from './graphql/__generated__/subscribeToChannelReadyNotification.interface';
import {
    setIsNotificationChannelInitialized,
    isNotificationChannelInitialized,
} from './isNotificationChannelInitialized';

let isSubscribed;

function handleChannelReady(channelReadyPayload: Schema.ChannelReadyNotification | undefined) {
    if (channelReadyPayload?.status == 'Ready' && !isNotificationChannelInitialized()) {
        setIsNotificationChannelInitialized();
    }
}

export function subscribeToChannelReadyNotification() {
    if (!isSubscribed) {
        isSubscribed = true;
        subscribeToChannelReadyNotificationInternal();
    }
}

function subscribeToChannelReadyNotificationInternal() {
    const apolloClient = getApolloClient();
    const apolloChannelReadySubscription = apolloClient.subscribe({
        query: SubscribeToNotificationChannelReadyDocument,
    });

    apolloChannelReadySubscription.subscribe({
        next: payload => handleChannelReady(payload?.data?.subscribeToNotificationChannelReady),
    });
}
