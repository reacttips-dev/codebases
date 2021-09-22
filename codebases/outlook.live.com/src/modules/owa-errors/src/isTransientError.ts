import { isOneOf } from './isOneOf';

const TransientErrors: string[] = [
    'ConnectionFailedTransient',
    'StorageTransient',
    'OwaLockTrackableTimeout',
    'MailboxInTransit',
    'MailboxInfoStale',
    'MailboxCrossSiteFailover',
    'OwaLockTimeout',
    'DCOverloaded',
    'ErrorInternalServerTransientError',
    'ErrorRightsManagementTransientException',
];

export function isTransientError(message: string | undefined) {
    return isOneOf(TransientErrors, message);
}
