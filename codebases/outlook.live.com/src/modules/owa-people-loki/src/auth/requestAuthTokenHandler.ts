import {
    AuthTokenProvider,
    AuthToken,
    setAuthToken as lokiSetAuthToken,
} from '@msfast/loki-auth-token';
import { clientCorrelationId } from '../lokiContext';
import { getLokiAuthTokenAsync } from './../services/getLokiAuthTokenAsync';

type RefreshAuthTokenCallback = (
    token: string,
    error: string,
    authRequestCorrelationId: string
) => void;

let authTokenProvider: AuthTokenProvider = undefined;
export let latestAuthToken: string = undefined;

export function getAuthToken(): Promise<AuthToken> {
    if (!authTokenProvider) {
        authTokenProvider = new AuthTokenProvider(
            () => clientCorrelationId,
            getRefreshAuthToken(),
            null,
            null
        );
    }

    return authTokenProvider.getAuthToken();
}

export function refreshAuthToken(
    onSuccess: (token: string, authRequestCorrelationId: string) => void,
    onFailure: (errorMessage: string, authRequestCorrelationId: string) => void
): void {
    getLokiAuthTokenAsync().then(token => {
        const authTokenRequestCorrelationId: string = clientCorrelationId;
        if (token) {
            setAuthToken(token);
            onSuccess(token, authTokenRequestCorrelationId);
        } else {
            onFailure('Failed to get auth token from Loki', authTokenRequestCorrelationId);
        }
    });
}

function setAuthToken(newAuthToken: string): void {
    latestAuthToken = newAuthToken;
    lokiSetAuthToken(clientCorrelationId, newAuthToken);
}

function getRefreshAuthToken(): (callback: RefreshAuthTokenCallback) => void {
    return function (callback: RefreshAuthTokenCallback): void {
        refreshAuthToken(
            (authToken: string, authRequestCorrelationId: string) => {
                callback(authToken, '', authRequestCorrelationId);
            },
            (errorMessage: string, authRequestCorrelationId: string) => {
                callback('', errorMessage, authRequestCorrelationId);
            }
        );
    };
}
