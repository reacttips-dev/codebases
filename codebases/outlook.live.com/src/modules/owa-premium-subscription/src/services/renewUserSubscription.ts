import { makePostRequest } from 'owa-ows-gateway';

const POST_SUBSCRIPTION_URL: string = 'ows/api/beta/PremiumSubscription/Renew';

export async function renewUserSubscription(): Promise<boolean> {
    return makePostRequest(POST_SUBSCRIPTION_URL, null);
}
