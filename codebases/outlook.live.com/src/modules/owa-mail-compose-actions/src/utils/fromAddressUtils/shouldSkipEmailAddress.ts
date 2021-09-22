import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

/**
 * Addresses that should not be exposed to the user, like Cloud Cache and EASID,
 * should be filtered out
 * Return true if this email address should be filtered out, otherwise false
 * @param emailAddress the address to check
 */
export default function shouldSkipEmailAddress(emailAddress: string): boolean {
    let shouldSkip = false;
    if (isConsumer()) {
        // NOTE: This can be skipped for enterprise users because the
        // two cases we are checking are consumer-only scenarios
        const userConfig = getUserConfiguration();
        emailAddress = emailAddress.toLowerCase();
        shouldSkip =
            emailAddress.indexOf('outlook_' + userConfig.HexCID) == 0 ||
            emailAddress.indexOf('@shadow.outlook.com') != -1;
    }

    return shouldSkip;
}
