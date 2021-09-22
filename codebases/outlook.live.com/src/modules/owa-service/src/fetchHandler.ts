import { getConfig } from './config';
import { HttpStatusCode } from './HttpStatusCode';
import { tryBackgroundAuth } from './tryBackgroundAuth';
import type { TraceErrorObject } from 'owa-trace';
import type { RequestOptions } from './RequestOptions';
import { isAuthNeeded } from './isAuthNeeded';
import { doAuthRedirect } from './doAuthRedirect';

const AuthError = 'NeedsAuth';

export default function fetchHandler<T>(
    actionName: string,
    response: Response,
    requestOptions: RequestOptions,
    callstackAtRequest?: string
): Promise<T | Response> {
    let errorMessage = getErrorMessage(response, requestOptions);
    if (requestOptions.returnFullResponseOnSuccess) {
        return errorMessage ? Promise.reject<Response>(response) : Promise.resolve(response);
    }

    if (errorMessage) {
        const responseError = createServerFailureError(
            actionName,
            errorMessage,
            response,
            callstackAtRequest
        );
        responseError.response = response;
        throw responseError;
    }

    if (response.headers.get('X-OWA-STO') != null) {
        tryBackgroundAuth();
    }

    if (requestOptions.returnResponseHeaders) {
        return Promise.resolve(response);
    }
    return response.json().catch((e: Error) => {
        throw createServerFailureError(actionName, e?.message, response, callstackAtRequest);
    });
}

interface ResponseWithSource extends Response {
    source?: string;
}

/**
 * Handles response errors. Returns null if no errors
 */
function getErrorMessage(
    response: ResponseWithSource,
    requestOptions: RequestOptions
): string | null {
    const config = getConfig();
    if (
        response.status == HttpStatusCode.Unauthorized ||
        response.status == HttpStatusCode.SessionTimeout
    ) {
        if (isAuthNeeded(requestOptions)) {
            // we only need to redirect if we are not doing token based auth
            if (config.onAuthFailed) {
                config.onAuthFailed(response.headers);
            } else {
                doAuthRedirect(response.headers);
            }
            response.source = AuthError;
            return AuthError;
        }
    } else if (!response.ok) {
        // Check if client is getting OwaHipRequiredExcpetion then he should be redirected to jsMvvm hip control
        // After user successfuly resolve captcha, he will be redirected to /owa which will force opt in user to /mail
        if (
            response.status == HttpStatusCode.PreconditionFailed &&
            config.onHipChallengeNeeded?.(response.headers)
        ) {
            response.source = AuthError;
            return AuthError;
        } else {
            return (response.headers && response.headers.get('x-owa-error')) || response.statusText;
        }
    }

    return null;
}

function createServerFailureError(
    actionName: string,
    message: string,
    response: Response,
    callstackAtRequest: string | undefined
) {
    const responseError: TraceErrorObject = new Error(`${actionName} failed: ${message}`);
    if (callstackAtRequest) {
        responseError.diagnosticInfo = callstackAtRequest;
    }
    responseError.fetchErrorType = message == AuthError ? 'AuthNeeded' : 'ServerFailure';
    responseError.httpStatus = response.status;
    return responseError;
}
