import { isFeatureEnabled } from 'owa-feature-flags';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getAccessTokenforResourceAsLazy, getDelegationTokenForOwa } from 'owa-tokenprovider';

const ENTERPRISE_NUDGE_TOKEN_RESOURCE = 'https://outlook.office.com/FocusedInboxB2';
const CONSUMER_NUDGE_TOKEN_RESOURCE = 'https://outlook.office.com/M365.Access';

export default async function getCustomHeadersForNudgeRequest(
    corelationId: string,
    apiName: string
) {
    const token = await getAccessTokenForNudge(corelationId, apiName);
    if (token) {
        const headers = new Headers();
        headers['authorization'] = `Bearer ${token}`;
        return headers;
    }

    return null;
}

async function getAccessTokenForNudge(corelationId: string, apiName: string): Promise<string> {
    if (!isConsumer()) {
        let [token, tokenPromise] = getAccessTokenforResourceAsLazy(
            ENTERPRISE_NUDGE_TOKEN_RESOURCE,
            apiName,
            corelationId
        );
        if (!token) {
            token = (await tokenPromise) as string;
        }

        return token as string;
    } else if (isFeatureEnabled('tri-nudge-consumer')) {
        return getDelegationTokenForOwa(CONSUMER_NUDGE_TOKEN_RESOURCE, apiName, corelationId);
    }

    return null;
}
