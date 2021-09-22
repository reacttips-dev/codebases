import shouldUseSilentUri from '../utils/useSilentUri';
import { unsubscribeFromBrandSubscription, onAfterUnsubscribe } from '../actions/publicActions';
import { orchestrator } from 'satcheljs';
import unsubscribeFromBrandSubscriptionService from '../services/unsubscribeFromBrandSubscriptionService';
import UnsubscribeResponseType from '../store/schema/unsubscribeResponseType';
import type UnsubscribeBrandsSubscriptionsServiceResponse from '../store/schema/UnsubscribeBrandsSubscriptionsServiceResponse';
import unsubscribeFromCache from '../mutators/unsubscribeFromCache';
import type { TraceErrorObject } from 'owa-trace';
import { isSuccessStatusCode } from 'owa-http-status-codes';

orchestrator(unsubscribeFromBrandSubscription, async actionMessage => {
    const {
        unsubscribeSourceType,
        smtpAddress,
        smtpIdentifier,
        unsubscribeSilentUris,
        unsubscribeHttpUri,
        completedCallback,
    } = actionMessage;
    let debugMessage: string;
    let status: UnsubscribeResponseType;

    if (
        (!unsubscribeHttpUri || unsubscribeHttpUri.length === 0) &&
        (!unsubscribeSilentUris || unsubscribeSilentUris.length === 0)
    ) {
        debugMessage = 'No unsubscribe URIs or SilentURIs provided';
        status = UnsubscribeResponseType.Fail;
        onAfterUnsubscribe(
            smtpIdentifier,
            unsubscribeSourceType,
            status,
            debugMessage,
            completedCallback
        );
        return Promise.reject('No unsubscribe URIs or SilentURIs provided');
    }

    if (
        (!unsubscribeSilentUris || !shouldUseSilentUri(unsubscribeSilentUris.length)) &&
        unsubscribeHttpUri
    ) {
        window.open(unsubscribeHttpUri, '_blank');
        debugMessage = 'Opened unsubscribe URI in new tab';
    } else {
        debugMessage = 'No unsubscribe URIs provided';
    }

    const response: Response = await unsubscribeFromBrandSubscriptionService(
        smtpIdentifier,
        unsubscribeSilentUris
    );

    let error = null;
    if (isSuccessStatusCode(response.status)) {
        // Prime sends a 200 instead of a 204 when the POST request for the Urls fails, but TEE call succeeded
        // In this case we open the failed URL in a new tab and consider a successfull unsubscribe like in a unsubscribeHttpUri scenario
        if (response.status === 200) {
            const unsubscribeResponse: UnsubscribeBrandsSubscriptionsServiceResponse = await response.json();
            if (unsubscribeResponse?.failedPostSilentHttpUris?.length > 0) {
                debugMessage = 'Opened failed silent URI in new tab';
                window.open(unsubscribeResponse.failedPostSilentHttpUris[0], '_blank');
            }
        }
        debugMessage = 'Unsubscribe service called successfully. ' + debugMessage;
        status = UnsubscribeResponseType.Success;
        unsubscribeFromCache(smtpAddress);
    } else {
        debugMessage = 'Unsubscribe service failed. ' + debugMessage;
        status = UnsubscribeResponseType.Fail;
        const responseObj = await response.text().then(text => (text ? JSON.parse(text) : {}));
        error = new Error(
            `ResponseCode=${response.status}, ErrorMessage=${responseObj?.error?.message}`
        ) as TraceErrorObject;

        error.fetchErrorType = 'ServerFailure';
    }

    onAfterUnsubscribe(
        smtpIdentifier,
        unsubscribeSourceType,
        status,
        debugMessage,
        completedCallback
    );

    if (error) {
        return Promise.reject(error);
    }

    return Promise.resolve();
});
