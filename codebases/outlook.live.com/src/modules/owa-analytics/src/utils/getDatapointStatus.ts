import type { TraceErrorObject } from 'owa-trace';
import { DatapointStatus } from '../types/DatapointEnums';
import {
    isMemoryError,
    ErrorType,
    isConfigurationError,
    isNetworkError,
    isThrottlingError,
    isTransientError,
    isOneOf,
} from 'owa-errors';

const accessDeniedErrors: string[] = [
    'ErrorAccessDenied',
    'AccessDeniedException',
    'RemoteCalendarAccessDenied',
];

const errorMapping: { [fetchErrorType: string]: ErrorType | true } = {
    RequestNotComplete: 'network',
    AuthNeeded: 'auth',
    RequestTimeout: 'timeout',
    Expected: true,
};

export interface StatusAndType {
    status: DatapointStatus;
    type?: ErrorType;
}

export default function getDatapointStatus(
    message?: string,
    error?: TraceErrorObject
): StatusAndType {
    if (isMemoryError(message)) {
        return { status: DatapointStatus.UserError, type: 'memory' };
    } else if (isTransientError(message)) {
        return { status: DatapointStatus.ServerExpectedError, type: 'transient' };
    } else if (isThrottlingError(message)) {
        return { status: DatapointStatus.ServerExpectedError, type: 'throttle' };
    } else if (isConfigurationError(message)) {
        return { status: DatapointStatus.ServerExpectedError, type: 'configuration' };
    } else if (isNetworkError(message)) {
        return { status: DatapointStatus.UserError, type: 'network' };
    } else if (isOneOf(accessDeniedErrors, message)) {
        return { status: DatapointStatus.ServerExpectedError, type: 'accessDenied' };
    } else if (error) {
        if (typeof error.httpStatus == 'number') {
            return error.httpStatus === 0 || Math.floor(error.httpStatus / 100) == 4
                ? { status: DatapointStatus.UserError, type: 'network' }
                : { status: DatapointStatus.ServerError };
        } else if (error.fetchErrorType) {
            const type = errorMapping[error.fetchErrorType];
            return {
                status: type ? DatapointStatus.UserError : DatapointStatus.ServerError,
                type: typeof type == 'string' ? type : undefined,
            };
        }
    }

    return {
        status: DatapointStatus.ClientError,
    };
}
