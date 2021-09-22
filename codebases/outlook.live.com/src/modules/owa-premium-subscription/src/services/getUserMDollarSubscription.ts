import { makeGetRequest, makePostRequest } from 'owa-ows-gateway';
import type { UserMDollarSubscriptionResponse } from './UserMDollarSubscriptionResponse';
import { isFeatureEnabled } from 'owa-feature-flags';

const GET_SUBSCRIPTION_URL: string = 'ows/api/beta/PremiumSubscription/MDollar';
const GET_UPDATEDSUBSCRIPTIONDATA_URL: string =
    'ows/api/beta/PremiumSubscription/GetUserSubscriptionInfo';

let getUserMDollarSubscriptionPromise: Promise<UserMDollarSubscriptionResponse>;

export function getUserMDollarSubscription(): Promise<UserMDollarSubscriptionResponse> {
    if (!getUserMDollarSubscriptionPromise) {
        // Call a new endpoint behind a feature flag which refreshes the mdollar sds data if it's stale.
        if (isFeatureEnabled('auth-RefreshMdollarSdsDataIfStale')) {
            getUserMDollarSubscriptionPromise = makePostRequest(
                GET_UPDATEDSUBSCRIPTIONDATA_URL,
                null
            );
        } else {
            // If feature flag is not enabled just pull data from sds.
            getUserMDollarSubscriptionPromise = makeGetRequest(GET_SUBSCRIPTION_URL);
        }
    }
    return getUserMDollarSubscriptionPromise;
}
