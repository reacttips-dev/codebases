import * as trace from 'owa-trace';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

/**
 * Whether specified smtpAddress is user self's smtp address
 * @param smtpAddress the smtp address in lower case
 * @return true if the specified smtpAddress is user self's smtp address
 */
export default function isSenderSelf(smtpAddress: string): boolean {
    const sessionSettings = getUserConfiguration().SessionSettings;
    const userEmailAddress = sessionSettings.UserEmailAddress;

    if (!userEmailAddress) {
        // Make sure userEmailAddress is valid in session data for further comparison
        trace.errorThatWillCauseAlert('User email address from session data is null.');
        return false;
    }

    if (!smtpAddress) {
        // in the case of no sender (ex: RSS aggregator add-in)
        return true; // To-do: Work Item 32667: Rename IsSenderSelf to IsSenderSelfOrNoSender
    }

    // Return true if the smtp address that tries to block is the userEmailAddress in session data,
    // Or it's the same with any address in the UserProxyAddresses array.
    return (
        smtpAddress.toLowerCase() == userEmailAddress.toLowerCase() ||
        (sessionSettings.UserProxyAddresses &&
            sessionSettings.UserProxyAddresses.some(
                address => address.toLowerCase() == smtpAddress
            ))
    );
}
