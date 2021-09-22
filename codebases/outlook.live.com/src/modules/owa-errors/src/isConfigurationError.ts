import { isOneOf } from './isOneOf';

const ConfigurationExceptions: string[] = [
    'InvalidLicense',
    'TenantAccessBlocked', // this exception happens when a tenant is marked for removal
    'UserHasNoMailbox', // primarily a licensing problem
    'AccountDisabled',
    'ErrorNonExistentMailbox',
    'ErrorMessageSizeExceeded',
];

export function isConfigurationError(message: string | undefined) {
    return isOneOf(ConfigurationExceptions, message);
}
