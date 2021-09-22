export interface ErrorResponse {
    error: string | object;
    errorDescription: string | object;
}

export interface FullErrorResponse {
    errorResponse: ErrorResponse;
    isSuccess: boolean;
}

export interface TooManyRequestsFullErrorResponse extends FullErrorResponse {
    retryAfter: number; // Period in seconds to wait before retrying again
}

export enum ErrorType {
    AccessRevoked = 0,
    AccountNotFound = 1,
    InvalidClient = 2,
    InvalidCredentials = 3,
    InvalidProvider = 4,
    MailboxDeprovisioned = 5,
    Transient = 6,
    PermissionDenied = 7,
    UserCancelled = 8,
    AadAuth = 9,
    Unknown = 10,
    ProviderUnavailable = 11,
    TooManyRequests = 12,
}
