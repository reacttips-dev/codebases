import type BootError from './interfaces/BootError';
import type { ErrorSource } from './interfaces/ErrorSource';

export default function createBootError(
    input: BootError | Response | string,
    source: ErrorSource,
    url?: string,
    status?: number
): BootError {
    const error: BootError = !!(window.Response && input instanceof window.Response)
        ? createBootErrorFromResponse(input)
        : typeof input === 'string'
        ? new Error(input)
        : (input as BootError);

    // don't override the source if we already have one
    addIfNotNull(error, 'source', source);
    addIfNotNull(error, 'url', url);
    addIfNotNull(error, 'status', status);
    return error;
}

function createBootErrorFromResponse(response: Response): BootError {
    const e: BootError = new Error();
    e.response = response;
    return e;
}

function addIfNotNull(error: BootError, column: string, value: any) {
    if (error[column] === undefined) {
        error[column] = value;
    }
}
