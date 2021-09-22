import { isOneOf } from './isOneOf';
import type { TraceErrorObject } from 'owa-trace';

const NetworkErrors = [
    ': Syntax error',
    'SyntaxError:',
    'A network error occurred',
    'Failed to fetch',
    'NetworkError',
    'Network request failed',
    'Internet connection appears to be',
    'The network connection was lost.',
    'Could not connect to the server',
    'cancelled. URL:',
    'ErrorSessionTimeout',
    'Loading chunk ',
    'Unexpected server response (0)',
    'Unexpected end of JSON input',
    'Unexpected token',
    'Invalid character',
    'Unexpected end of input',
    'The operation was aborted',
    'Failed to load javascript',
];

export function isNetworkError(message: string | undefined, error?: TraceErrorObject) {
    return isOneOf(NetworkErrors, message) || error?.networkError;
}
