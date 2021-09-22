import { makeGetRequest } from 'owa-ows-gateway';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import type GetBrandsSubscriptionsServiceResponse from '../store/schema/GetBrandsSubscriptionsServiceResponse';
import populateSubscriptionStore from '../mutators/populateSubscriptionStore';

const GET_BRANDS_SUBSCRIPTION_URL: string = 'ows/api/beta/subscriptions?orderBy=name, asc';

async function getBrandsSubscriptionsService(
    dontLoadBrandsInfo?: boolean
): Promise<GetBrandsSubscriptionsServiceResponse> {
    const response = await makeGetRequest(
        dontLoadBrandsInfo
            ? GET_BRANDS_SUBSCRIPTION_URL + '&noResolveBrand=true'
            : GET_BRANDS_SUBSCRIPTION_URL,
        undefined /* correlationId */,
        true /* returnFullResponse */
    );
    if (isSuccessStatusCode(response.status)) {
        const unsubscribeResponse = await response.json();
        populateSubscriptionStore(unsubscribeResponse);
        return unsubscribeResponse;
    }

    return null;
}

export default getBrandsSubscriptionsService;
