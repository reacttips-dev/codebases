import { isOneOf } from './isOneOf';
import { isNonOwaError } from './isNonOwaError';
import { TraceErrorObject, EmptyErrorStack } from 'owa-trace';

const knownExternalStrings: string[] = [
    'https://swc.cdn.skype.com',
    'https://acdn.adnxs.com/',
    'https://s.aolcdn.com',
    '/resources/suiteux-shell/',
    'lpcres.delve.office.com/',
    'webshell.suite.office.com',
    'jac.yahoosandbox.com',
    '/owa.vendors~Prague.js',
    '/owa.gfh-itemsview.js',
    // This error means that ResizeObserver was not able to deliver all
    // observations within a single animation frame. It is benign
    'ResizeObserver loop ',
    'EncodingError: Unable to decode audio data',
    'gcm_sender_id not found in manifest',
    'at checkUnread (<anonymous>:',
    'moz-extension://',
    'ms-browser-extension://',
    'Unhandled Rejection: AbortError: The operation was aborted.',
    'https://goo.gl/',
    'AppNexus namespace blocked',
    'Unknown script code',
    'electron/js2c',
    'debugger eval code',
    'amcdn.msftauth.net',
    'Telemetry is not configured!',
];

const knownExternalStringsWithNoStack: string[] = [
    // these errors come from the suite header and give no call stack
    'Unhandled Rejection: Already Initialized',
    '{"status":',
    '{"isCanceled":true}',
    '{"callCount":',
    '{"resultCode":2,"isAdalException":false,"_typeSpec":"TokenRetrievalError"}',
    '{"ok":false,"status":0,',
    '{}',
    "'window' is not defined",
    "'window' is undefined",
    ',"name":"ShellException"',
    '{"line":0,"column":0}',
    // This means that unhandledrejection was called was no arguments.
    // There is nothing that we can do with this so marking it as external
    'Unhandled Rejection: [no reason given]',
    'SecurityError',
];
export function isExternalError(message: string, error: TraceErrorObject | undefined): boolean {
    if (isOneOf(knownExternalStrings, message)) {
        return true;
    }
    return (
        !!error &&
        (error.external ||
            isNonOwaError(error.stack) ||
            isOneOf(knownExternalStrings, error.stack) ||
            (isEmptyCallstack(<string>error.stack) &&
                isOneOf(knownExternalStringsWithNoStack, message || error.message)))
    );
}

function isEmptyCallstack(stack: string) {
    return /\S/.test(stack) || stack == EmptyErrorStack;
}
