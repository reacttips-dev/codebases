import { makePostRequest } from 'owa-ows-gateway';
import type { UserMDollarSubscriptionResponse } from './UserMDollarSubscriptionResponse';

const POST_SUBSCRIPTION_URL: string = 'ows/api/beta/PremiumSubscription/MDollar';

export async function fetchUserMDollarSubscription(): Promise<UserMDollarSubscriptionResponse> {
    return makePostRequest(POST_SUBSCRIPTION_URL, null);
}
