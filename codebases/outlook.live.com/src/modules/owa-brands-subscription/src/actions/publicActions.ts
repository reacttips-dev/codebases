import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type UnsubscribeResponseType from '../store/schema/unsubscribeResponseType';
import type UnsubscribeSourceType from '../store/schema/unsubscribeSourceType';

/**
 * Common action to unsubscribe from a Brand Subscription. completedCallback is used for logging purposes only.
 */
export const unsubscribeFromBrandSubscription = action(
    'UNSUBSCRIBE_FROM_BRAND_SUBSCRIPTION',
    (
        unsubscribeSourceType: UnsubscribeSourceType,
        smtpAddress: string,
        smtpIdentifier: string,
        unsubscribeSilentUris: string[],
        unsubscribeHttpUri: string,
        completedCallback?: any
    ) =>
        addDatapointConfig(
            {
                name: 'UnsubscribeSubscription',
                customData: {
                    unsubscribeSourceType: unsubscribeSourceType,
                },
            },
            {
                unsubscribeSourceType: unsubscribeSourceType,
                smtpAddress: smtpAddress,
                smtpIdentifier: smtpIdentifier,
                unsubscribeSilentUris: unsubscribeSilentUris,
                unsubscribeHttpUri: unsubscribeHttpUri,
                completedCallback: completedCallback,
            }
        )
);

/**
 * Action dispatched after the unsubscription from brand subscription action is dispatched.
 */
export const onAfterUnsubscribe = action(
    'AFTER_UNSUBSCRIBE',
    (
        smtpIdentifier: string,
        unsubscribeSourceType: UnsubscribeSourceType,
        responseType: UnsubscribeResponseType,
        debugMessage: string,
        completedCallback?: any
    ) => ({
        smtpIdentifier,
        unsubscribeSourceType,
        responseType,
        debugMessage,
        completedCallback,
    })
);
