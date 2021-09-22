import { isFeatureEnabled } from 'owa-feature-flags';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getAccessTokenforResourceAsLazy, getDelegationTokenForOwa } from 'owa-tokenprovider';
import getConnectorsLTIToken from './getConnectorsLTIToken';

const CONNECOTRS_RESOURCE_URL = 'https://outlook.office365.com/connectors';
const MSA_TOKEN_SCOPE = 'User.Read';

export default function getClientAuthToken(): Promise<string> {
    if (isFeatureEnabled('rp-actionableMessages-aad-token') && !isConsumer()) {
        return getAADToken();
    } else if (isFeatureEnabled('rp-actionableMessages-msa-token') && isConsumer()) {
        return getMSAToken();
    } else {
        return getConnectorsLTIToken();
    }
}

export async function getMSAToken(): Promise<string> {
    const msaToken = await getDelegationTokenForOwa(MSA_TOKEN_SCOPE);
    return msaToken;
}

export async function getAADToken(): Promise<string> {
    let [token, tokenPromise] = getAccessTokenforResourceAsLazy(
        CONNECOTRS_RESOURCE_URL,
        'OwaConnectors'
    );

    // If token is not returned synchronously, we need to await on the tokenPromise
    if (!token) {
        token = (await tokenPromise) as string;
    }

    return token as string;
}
