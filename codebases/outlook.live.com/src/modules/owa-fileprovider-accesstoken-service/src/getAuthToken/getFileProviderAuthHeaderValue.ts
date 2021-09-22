import addMinutes from 'date-fns/add_minutes';
import { format } from 'owa-localize';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type TokenResponse from 'owa-service/lib/contract/TokenResponse';
import TokenResponseCode from 'owa-service/lib/contract/TokenResponseCode';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getDelegationTokenForOwa } from 'owa-tokenprovider';
import getFileProviderAccessTokenService, {
    FileProviderAccessTokenResponse,
} from './getFileProviderAccessToken';
import { BEARER_TOKEN_HEADER_PREFIX, ONE_DRIVE_CONSUMER_TOKEN_SCOPE } from '../constants';
import { isFeatureEnabled } from 'owa-feature-flags';

interface ResourceUrlToTokenResponseMap {
    [key: string]: TokenResponse;
}

export interface TokenRetrievalError extends Error {
    resultCode: TokenResponseCode;
    isAdalException: boolean;
    // type spec field is used for determining that a given object is a TokenRetrievalError, see isTokenRetrievalError method below
    _typeSpec: 'TokenRetrievalError';
}

const newTokenRetrievalError = (
    error: Error,
    resultCode: TokenResponseCode,
    isAdalException: boolean
): TokenRetrievalError => {
    return {
        resultCode: resultCode,
        isAdalException: isAdalException,
        _typeSpec: 'TokenRetrievalError',
        ...error,
    };
};

export const isTokenRetrievalError = (error: Error): error is TokenRetrievalError => {
    return (error as TokenRetrievalError)._typeSpec === 'TokenRetrievalError';
};

let tokensBeingRefreshed: string[] = [];
const accessTokensMap: { [key: number]: ResourceUrlToTokenResponseMap } = {};
const MIN_TIME_TO_EXPIRY_IN_MINUTES = 1;
const MIN_TIME_TO_TOKEN_REFRESH_IN_MINUTES = 30;
const DEFAULT_RESOURCE_URL: string = '';

// tenants can have different policy setup for OWA and Sharepoint in which case getting a token from AAD will lead to permanent failures. So treating such error differently.
// More details - https://microsoft.sharepoint-df.com/:p:/r/teams/OPGAADConditionalAccessCAPoliciesWorkingGroup/_layouts/15/Doc.aspx?sourcedoc=%7B8bf8e168-4841-43b2-861d-2c50ac7404d3%7D
const AADPolicyError: string =
    'Microsoft.IdentityModel.Clients.ActiveDirectory.AdalServiceException';

export function initializeAccessTokenMapForTest(
    key: AttachmentDataProviderType,
    token: TokenResponse
) {
    accessTokensMap[key][DEFAULT_RESOURCE_URL] = token;
}

export function clearToken(providerType: AttachmentDataProviderType) {
    accessTokensMap[providerType] = null;
}

function processResult(
    type: AttachmentDataProviderType,
    resourceUrl: string,
    response: FileProviderAccessTokenResponse
) {
    tokensBeingRefreshed = tokensBeingRefreshed.filter(url => url !== resourceUrl);
    const tokenResponse: TokenResponse = response.token;
    if (
        tokenResponse.TokenResultCode === TokenResponseCode.Success &&
        tokenResponse.AccessToken &&
        tokenResponse.AccessToken !== ''
    ) {
        // Cache the access tokens
        const tokenResponses: ResourceUrlToTokenResponseMap = accessTokensMap[type] || {};
        tokenResponses[resourceUrl] = tokenResponse;
        accessTokensMap[type] = tokenResponses;
    } else {
        const message = `Access token request failed for token key ${type} with response code ${tokenResponse.TokenResultCode}`;

        const tokenResult: string = response.response.headers.get('x-tokenresult');
        const isAdalError: boolean = tokenResult != null && tokenResult.indexOf(AADPolicyError) > 0;
        throw newTokenRetrievalError(
            new Error(message),
            tokenResponse.TokenResultCode,
            isAdalError
        );
    }
}

function isCachedTokenAvailable(type: AttachmentDataProviderType, resourceUrl: string) {
    // Check if there is a cached token that can be used
    const tokenResponses = accessTokensMap[type];
    if (!tokenResponses) {
        return false;
    }

    const tokenResponse = tokenResponses[resourceUrl];

    if (!tokenResponse || !tokenResponse.AccessTokenExpiry) {
        return false;
    }

    const expiryDateTime = new Date(tokenResponse.AccessTokenExpiry);
    const currentDatePlusMinTimeToExpiry = addMinutes(
        new Date(Date.now()),
        MIN_TIME_TO_EXPIRY_IN_MINUTES
    );

    // Check that token is valid for at least 1 minute.
    return expiryDateTime != null && currentDatePlusMinTimeToExpiry < expiryDateTime;
}

async function getAccessTokenAndProcessRequest(
    fileProviderType: AttachmentDataProviderType,
    resourceUrl: string,
    actionSource: string,
    claimsChallenge?: string
): Promise<TokenResponse> {
    const response = await getFileProviderAccessTokenService(
        fileProviderType,
        resourceUrl,
        actionSource,
        claimsChallenge
    );

    processResult(fileProviderType, resourceUrl, response);
    return response.token;
}

export async function getFileProviderAccessToken(
    fileProviderType: AttachmentDataProviderType,
    forceTokenRefresh: boolean,
    fullUrl: string | undefined,
    claimsChallenge?: string
): Promise<string> {
    let resourceUrl = DEFAULT_RESOURCE_URL;

    if (fileProviderType === AttachmentDataProviderType.OneDrivePro && fullUrl) {
        const parsedUrl = new URL(fullUrl);
        resourceUrl = format('{0}//{1}/', parsedUrl.protocol, parsedUrl.hostname);
    }

    if (isFeatureEnabled('doc-attachment-testAuthFallback')) {
        return '';
    } else {
        return getFileProviderAccessTokenForResource(
            fileProviderType,
            resourceUrl,
            forceTokenRefresh,
            null /* actionSource */,
            claimsChallenge
        );
    }
}

export async function getOneDriveProAccessTokenForResource(
    resourceUrl: string,
    forceTokenRefresh: boolean,
    actionSource: string
): Promise<string> {
    return getFileProviderAccessTokenForResource(
        AttachmentDataProviderType.OneDrivePro,
        resourceUrl,
        forceTokenRefresh,
        actionSource
    );
}

async function getFileProviderAccessTokenForResource(
    fileProviderType: AttachmentDataProviderType,
    resourceUrl: string,
    forceTokenRefresh: boolean,
    actionSource: string,
    claimsChallenge?: string
): Promise<string> {
    if (!forceTokenRefresh && isCachedTokenAvailable(fileProviderType, resourceUrl)) {
        const tokenResponses = accessTokensMap[fileProviderType];
        const tokenResponse = tokenResponses[resourceUrl];

        const currentDatePlusMinTimeToRefresh = addMinutes(
            new Date(Date.now()),
            MIN_TIME_TO_TOKEN_REFRESH_IN_MINUTES
        );

        // If the token is going to expire soon we kick off an async request to refresh it, unless another such request is already in progress.
        if (
            currentDatePlusMinTimeToRefresh > new Date(tokenResponse.AccessTokenExpiry) &&
            tokensBeingRefreshed.indexOf(resourceUrl) === -1
        ) {
            tokensBeingRefreshed.push(resourceUrl);
            getAccessTokenAndProcessRequest(fileProviderType, resourceUrl, actionSource);
        }

        return tokenResponse.AccessToken;
    } else {
        const tokenResponse = await getAccessTokenAndProcessRequest(
            fileProviderType,
            resourceUrl,
            actionSource,
            claimsChallenge
        );

        // TODO: Bug 12430 - handle responses with an HTTP response code besides 200.
        return tokenResponse.AccessToken;
    }
}

export default async function getFileProviderAuthHeaderValue(
    providerType: AttachmentDataProviderType,
    forceTokenRefresh: boolean,
    fullUrl: string,
    claimsChallenge?: string
): Promise<string> {
    let token: string;
    if (isConsumer() && providerType === AttachmentDataProviderType.OneDriveConsumer) {
        token = await getDelegationTokenForOwa(ONE_DRIVE_CONSUMER_TOKEN_SCOPE);
    } else {
        token = await getFileProviderAccessToken(
            providerType,
            forceTokenRefresh,
            fullUrl,
            claimsChallenge
        );
    }
    return BEARER_TOKEN_HEADER_PREFIX + token;
}
