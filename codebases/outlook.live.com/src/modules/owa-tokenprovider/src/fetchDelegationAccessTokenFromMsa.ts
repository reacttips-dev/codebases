import * as queryString from 'querystring';
import addSeconds from 'owa-date-utc-fn/lib/addSeconds';
import type TokenResponse from 'owa-service/lib/contract/TokenResponse';
import TokenResponseCode from 'owa-service/lib/contract/TokenResponseCode';
import { logStartUsage } from 'owa-analytics-start';

const SCENARIO_NAME = 'OWA_GetDelegationAccessToken';

export interface Options {
    client_id: string;
    scope: string;
    redirect_uri: string;
    authorization_uri: string;
    requestId?: string;
}

let eventListners = {};

export async function fetchDelegationAccessTokenFromMsa(opts: Options): Promise<TokenResponse> {
    let iframeId = encodeURIComponent(opts.client_id + opts.scope + opts.requestId);
    let tokenResponse: TokenResponse = {};
    try {
        tokenResponse = await internalFetchDelegationAccessTokenFromMsa(opts, window, iframeId);
    } catch (exception) {
        tokenResponse.TokenResultCode = TokenResponseCode.Failed;
    } finally {
        cleanUpIframe(iframeId, window);
    }
    return tokenResponse;
}

async function internalFetchDelegationAccessTokenFromMsa(
    opts: Options,
    parentWindow: Window,
    iframeId: string
): Promise<TokenResponse> {
    let url = getAuthenticationUrl(opts);
    if (!parentWindow.document.getElementById(iframeId)) {
        const iframe = parentWindow.document.createElement('iframe');
        iframe.src = url.toString();
        iframe.style.display = 'none';
        iframe.id = iframeId;
        parentWindow.document.body.appendChild(iframe);
        return new Promise((resolve, reject) => {
            eventListners[iframeId] = function (e: any) {
                let tokenResponse: TokenResponse = {};
                try {
                    if (
                        iframe.contentWindow &&
                        iframe.contentWindow.location.host == parentWindow.location.host
                    ) {
                        tokenResponse = ParseHashParam(
                            iframe.contentWindow.location.hash.substring(1),
                            opts.requestId
                        );
                    }
                } catch (exception) {
                    logStartUsage(SCENARIO_NAME + ' Hash Param Parsing Failure ', {
                        err: exception.toString(),
                        message: exception.message,
                        stk: exception.stack || '',
                        scope: opts.scope,
                        uri: opts.redirect_uri,
                        requestId: opts.requestId,
                    });
                    tokenResponse.TokenResultCode = TokenResponseCode.Failed;
                    reject(tokenResponse);
                }
                resolve(tokenResponse);
            };
            iframe.addEventListener('load', eventListners[iframeId], false);
        });
    }

    return { TokenResultCode: TokenResponseCode.Failed };
}

export function ParseHashParam(hashParam: string, requestId: string | undefined): TokenResponse {
    let params = queryString.parse(hashParam);
    let tokenResponse: TokenResponse = {};
    if (params.access_token) {
        tokenResponse.AccessToken = params.access_token;
        tokenResponse.AccessTokenExpiry = addSeconds(
            Date.now(),
            parseInt(params.expires_in)
        ).toISOString();
        tokenResponse.TokenResultCode = TokenResponseCode.Success;
    } else if (
        params.error == 'login_required' ||
        params.error == 'interaction_required' ||
        params.error == 'consent_required'
    ) {
        tokenResponse.TokenResultCode = TokenResponseCode.Unauthorized;
        logStartUsage(SCENARIO_NAME + ' MSA Failure Unauthorized', {
            error: params.error,
            param: hashParam,
            requestId: requestId,
        });
    } else {
        tokenResponse.TokenResultCode = TokenResponseCode.Failed;
        logStartUsage(SCENARIO_NAME + ' MSA Failure', {
            error: params.error,
            param: hashParam,
            requestId: requestId,
        });
    }

    return tokenResponse;
}

function cleanUpIframe(id: string, window: Window) {
    var element = window.document.getElementById(id);
    if (element != null) {
        element.removeEventListener('load', eventListners[id]);
        window.document.body.removeChild(element);
        delete eventListners[id];
    }
}

export function getAuthenticationUrl(opts: Options): string {
    let queryParams = {
        response_type: 'token',
        prompt: 'none', // silent auth, don't prompt the user
        redirect_uri: opts.redirect_uri,
        scope: opts.scope,
        client_id: opts.client_id,
    };

    return opts.authorization_uri + '?' + queryString.stringify(queryParams);
}
