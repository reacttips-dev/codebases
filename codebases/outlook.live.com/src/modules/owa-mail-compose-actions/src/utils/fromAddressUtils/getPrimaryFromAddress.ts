import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

/**
 * Get the primary from email address, i.e. the address used to initially create the account
 */
export default function getPrimaryFromAddress(): string {
    return getUserConfiguration().SessionSettings.UserEmailAddress;
}
