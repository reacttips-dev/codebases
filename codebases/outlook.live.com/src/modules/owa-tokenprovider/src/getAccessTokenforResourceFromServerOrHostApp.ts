import type TokenResponse from 'owa-service/lib/contract/TokenResponse';
import tokenRequest from 'owa-service/lib/factory/tokenRequest';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import sleep from 'owa-sleep';
import addSeconds from 'owa-date-utc-fn/lib/addSeconds';
import getAccessTokenforResourceOperation from 'owa-service/lib/operation/getAccessTokenforResourceOperation';
import { getUserToken } from './utils/userTokenHandler';
import { getOrigin } from 'owa-url/lib/getOrigin';
import TokenResponseCode from 'owa-service/lib/contract/TokenResponseCode';
import { getOpxHostApi } from 'owa-opx';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { TraceErrorObject } from 'owa-trace';
import { getForest } from 'owa-config';
import { isFeatureEnabled } from 'owa-feature-flags';
import { logStartUsage } from 'owa-analytics-start';

export const SCENARIO_NAME = 'OWA_GetAccessTokenForResource';
const ERRORS_TO_IGNORE = ['requestnotcomplete', 'requesttimeout'];

export default async function getAccessTokenforResourceFromServerOrHostApp(
    resource: string,
    retryCount: number,
    requestId: string,
    apiName?: string,
    targetTenantId?: string,
    wwwAuthenticateHeader?: string,
    preferIdpToken?: boolean
): Promise<TokenResponse> {
    const userToken = await getUserToken();
    const origin = getOrigin();
    if (userToken && (resource == origin || resource == origin + '/')) {
        return { AccessToken: userToken };
    }

    // For notification channel, we issue a LTI token, this needs to be requested from OWA BE.
    // For image proxy, we issue a STI token, this needs to be requested from OWA BE.
    // No need to pass the user token in request body as these requests are not OBO requests.
    if (
        resource.toLowerCase().indexOf('/notificationchannel') > 0 ||
        resource.toLowerCase().indexOf('/outlookimageproxy.azurewebsites.net') > 0
    ) {
        return getAccessTokenforResourceFromServer(
            resource,
            retryCount,
            requestId,
            apiName,
            targetTenantId
        );
    }

    if (isHostAppFeatureEnabled('resourceTokenFromHost')) {
        const opxHostApi = getOpxHostApi();
        // for notification channel request fetch a LTI token from server
        if (
            opxHostApi.isResourceTokenPrefetchEnabled &&
            (await opxHostApi.isResourceTokenPrefetchEnabled()) &&
            opxHostApi.getResourceToken
        ) {
            const resourceToken = await opxHostApi.getResourceToken(
                resource,
                wwwAuthenticateHeader
            );
            if (
                resourceToken &&
                resourceToken.length > 0 &&
                resourceToken.split(' ')[0]?.toLowerCase() === 'bearer' && // check if the token has bearer prefix
                resourceToken.split(' ')[1]?.length > 0
            ) {
                return {
                    AccessToken: resourceToken.split(' ')[1],
                    TokenResultCode: TokenResponseCode.Success,
                    ExpiresIn: 3600, // value in seconds
                    AccessTokenExpiry: addSeconds(Date.now(), 3600).toISOString(), // keeping the token validity for 1 hour
                };
            }
        }
    }

    return getAccessTokenforResourceFromServer(
        resource,
        retryCount,
        requestId,
        apiName,
        targetTenantId,
        preferIdpToken,
        userToken
    );
}

export async function getAccessTokenforResourceFromServer(
    resource: string,
    retryCount: number,
    requestId: string,
    apiName?: string,
    targetTenantId?: string,
    preferIdpToken?: boolean,
    userToken?: string
): Promise<TokenResponse> {
    const options: RequestOptions = {
        isUserActivity: false,
        datapoint: {
            customData: {
                Scenario: SCENARIO_NAME,
                Resource_Url: resource,
                Retry_attempt: retryCount,
                Request_Id: requestId,
                Target_Tenant_Id: targetTenantId || '',
                Api: apiName || '',
            },
            headersCustomData: (headers: Headers) => {
                return {
                    TokenResultDetails: headers.get('x-tokenresult') || '',
                    ServerRequestId: headers.get('request-id') || '',
                };
            },
            jsonCustomData: (tokenResponse: TokenResponse) => {
                return {
                    TokenStatus:
                        tokenResponse?.TokenResultCode?.toString() || TokenResponseCode.Failed,
                };
            },
            datapointOptions: {
                isCore:
                    getForest()?.toLowerCase() == 'lamp152' ||
                    isFeatureEnabled('auth-logAllDataPointForTokenFetching'),
            },
        },
        returnFullResponseOnSuccess: true,
    };

    const response = await (getAccessTokenforResourceOperation(
        tokenRequest({
            Resource: resource,
            UserToken: userToken,
            TargetTenantId: targetTenantId,
            PreferIdpToken: preferIdpToken,
        }),
        options
    ) as Promise<Response>);

    return (await response.json()) as TokenResponse;
}

/**
 * Adds a retry with timeout when fetching Access Token from server
 * @param resource - the resource string
 * @param retryCount - the retry count
 * @param retryDelay - time between 2 retries
 * @param requestId - the requestId
 * @param apiName - name of the api
 * @param preferIdpToken - request the auth service to send an AAD token
 * @returns - TokenResponse wrapped around in a Promise
 */
export async function getAccessTokenforResourceFromServerOrHostAppWithRetry(
    resource: string,
    retryCount: number,
    retryDelay: number,
    requestId: string,
    apiName?: string,
    targetTenantId?: string,
    wwwAuthenticateHeader?: string,
    preferIdpToken?: boolean
): Promise<TokenResponse> {
    if (retryCount < 1) {
        return Promise.reject('Max retrying limit (3) reached.');
    }

    return getAccessTokenforResourceFromServerOrHostApp(
        resource,
        retryCount,
        requestId,
        apiName,
        targetTenantId,
        wwwAuthenticateHeader,
        preferIdpToken
    ).catch(error => {
        // Retry only on transient errors
        if (isTransientError(error)) {
            sleep(retryDelay).then(() => {
                return getAccessTokenforResourceFromServerOrHostAppWithRetry(
                    resource,
                    retryCount - 1,
                    retryDelay * 2,
                    requestId,
                    apiName,
                    targetTenantId,
                    wwwAuthenticateHeader,
                    preferIdpToken
                );
            });
        }

        logStartUsage(
            `${SCENARIO_NAME}::NonTransientError`,
            {
                err: error?.toString() ?? '',
                message: error?.message ?? '',
                stk: error?.stack ?? '',
                resource: resource,
                requestId: requestId,
                apiName: apiName ?? '',
            },
            {
                isCore:
                    getForest()?.toLowerCase() == 'lamp152' ||
                    isFeatureEnabled('auth-logAllDataPointForTokenFetching'),
            }
        );

        return Promise.reject(error);
    });
}

function isTransientError(error: Error): boolean {
    const traceError = error as TraceErrorObject;
    const errorType = traceError?.fetchErrorType?.toLowerCase() ?? '';
    return ERRORS_TO_IGNORE.indexOf(errorType) == -1;
}
