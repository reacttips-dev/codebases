import { isOneOf } from './isOneOf';

const ThrottlingErrors: string[] = [
    'OverBudget',
    'TooManyObjectsOpened',
    'ErrorServerBusy',
    'MailboxStoreUnavailable',
];

export function isThrottlingError(message: string | undefined) {
    return isOneOf(ThrottlingErrors, message);
}
