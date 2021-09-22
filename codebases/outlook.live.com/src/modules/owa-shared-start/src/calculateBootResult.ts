import type { ErrorSource } from './interfaces/ErrorSource';
import type { BootResult } from './interfaces/BootResult';
import type BootError from './interfaces/BootError';
import type StartConfig from './interfaces/StartConfig';
import { isExplicitLogonSession } from 'owa-config/lib/isExplicitLogonSession';
import {
    isMemoryError,
    isNonOwaError,
    isOneOf,
    isConfigurationError,
    isNetworkError,
    isThrottlingError,
    isTransientError,
} from 'owa-errors';
import type ErrorDiagnostics from './interfaces/ErrorDiagnostics';

const statusToBootResultMapping: { [status: number]: BootResult } = {
    0: 'network',
    401: 'auth',
    412: 'optin',
    440: 'auth',
};

const whiteListedErrorSources: ErrorSource[] = ['ExpiredBuild', 'PoisonedBuild'];
const invalidLanguageExceptionList = [
    'OwaInvalidTimezoneException',
    'OwaInvalidOperationException',
    'OwaInvalidUserLanguageException',
];

// all of these exceptions happen when you try to open another mailbox that you don't have access to
const explicitLogonAccessDeniedExceptions: string[] = [
    'AccessDeniedException',
    'MailboxUnavailableException',
    'OwaExplicitLogonException',
    'OwaADObjectNotFoundException',
];

export default function calculateBootResult(
    error: BootError | undefined,
    errorDiagnostics: ErrorDiagnostics,
    config?: StartConfig
): BootResult {
    const errorMessage = errorDiagnostics.err;
    if (isOneOf(invalidLanguageExceptionList, errorMessage)) {
        return 'langtz';
    }
    if (isThrottlingError(errorMessage)) {
        return 'throttle';
    }
    const isConfigError = config?.isConfigError || isConfigurationError;
    if (isConfigError(errorMessage)) {
        return 'configuration';
    }

    // check if the current error message or any previous errors messages are a memory error
    if (
        isMemoryError(errorMessage) ||
        (error && isNonOwaError(error.stack)) ||
        (window.owaBackfilledErrors &&
            window.owaBackfilledErrors.filter(args => isMemoryError(args[0])).length > 0)
    ) {
        return 'memory';
    }
    if (error) {
        const response = error.response;
        let skipErrorfe = false;
        if (config?.skipErrorFe && response?.url) {
            skipErrorfe = config.skipErrorFe(response.url.toLowerCase());
        }
        if (
            response?.url &&
            response.url.toLowerCase().indexOf('/auth/errorfe.aspx') > -1 &&
            !skipErrorfe
        ) {
            return 'errorfe';
        }
        // if the error has a request object, then webpack or fetchLocStrings
        // tried to download a resource from the CDN but couldn't. In these cases
        // we have failed because there is a problem with the CDN or a user has a proxy
        // or firewall setup that messes with the request. We will track these separately
        // than startup errors
        if (error.request) {
            return 'cdnError';
        }
    }
    const source = errorDiagnostics.esrc;
    if (source && whiteListedErrorSources.indexOf(source) > -1) {
        return <BootResult>source;
    }
    const status = errorDiagnostics.st;
    if (source == 'InitLoc' && status != 0) {
        // Loc files are loaded from the CDN, which we expect should always succeed.  Any failure
        // (other than 'network') should be treated as 'fail'.
        return 'fail';
    }
    if (
        isExplicitLogonSession(window) &&
        isOneOf(explicitLogonAccessDeniedExceptions, errorMessage)
    ) {
        return 'accessDenied';
    }
    if (isTransientError(errorMessage) || status == 503) {
        return 'transient';
    }
    if (isNetworkError(errorMessage, error)) {
        return 'network';
    }
    return statusToBootResultMapping[<number>status] || 'fail';
}
