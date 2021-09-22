import getPrimaryFromAddress from './getPrimaryFromAddress';
import shouldSkipEmailAddress from './shouldSkipEmailAddress';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

/**
 * Gets all addresses a user can send from, including the default email address,
 * alias addresses, and connected account addresses
 * @param includeProxyAddressesForEnt, whether or not we should include user
 * proxy addresses for enterprise users
 */
export default function getAllFromAddresses(includeProxyAddressesForEnt: boolean): string[] {
    let sendAsAddresses: string[] = [];

    // Add the primary account address
    const primaryAddress = getPrimaryFromAddress();
    if (!shouldSkipEmailAddress(primaryAddress)) {
        sendAsAddresses.push(primaryAddress);
    }

    // Add alias addresses
    const aliasAddresses = getAliasAddresses(primaryAddress, includeProxyAddressesForEnt);
    sendAsAddresses = sendAsAddresses.concat(aliasAddresses);

    // Add connected accounts
    sendAsAddresses = getConnectedAccounts(sendAsAddresses);

    return sendAsAddresses;
}

/**
 * Gets alias addresses, i.e. user proxy addresses and not managed email addresses
 * @param primaryAddress, the user's primary email address
 * @param includeProxyAddressesForEnt, whether or not we should include user
 * proxy addresses for enterprise users
 */
export function getAliasAddresses(
    primaryAddress: string,
    includeProxyAddressesForEnt: boolean
): string[] {
    let aliasAddresses = [];

    // Add user proxy addresses for enterprise users if the flag is denoted,
    // and always for consumers (VSO 56303)
    if (isConsumer() || includeProxyAddressesForEnt) {
        const userProxyAddresses = getUserProxyAddresses(primaryAddress);
        aliasAddresses = aliasAddresses.concat(userProxyAddresses);
    }

    // Add not managed email addresses for consumers
    if (isConsumer()) {
        const notManagedEmailAddresses = getNotManagedEmailAddresses(primaryAddress);
        aliasAddresses = aliasAddresses.concat(notManagedEmailAddresses);
    }

    return aliasAddresses;
}

// NOTE: below functions are exported for testing, otherwise only used internally

/**
 * Gets connected accounts, i.e. external email addresses users have connected to their accounts
 * @param currentList, the user's current email addresses
 */
export function getConnectedAccounts(currentList: string[]): string[] {
    const connectedAccountInfos = getUserConfiguration().SessionSettings.ConnectedAccountInfos;

    if (connectedAccountInfos && connectedAccountInfos.length > 0) {
        connectedAccountInfos.forEach(connectedAccount => {
            if (currentList.lastIndexOf(connectedAccount.EmailAddress) == -1) {
                currentList.push(connectedAccount.EmailAddress);
            }
        });
    }

    return currentList;
}

/**
 * Gets user proxy addresses
 * @param primaryAddress, the user's primary email address
 */
export function getUserProxyAddresses(primaryAddress: string): string[] {
    return filterEmailAddresses(
        primaryAddress,
        getUserConfiguration().SessionSettings.UserProxyAddresses
    );
}

/**
 * Gets not managed email addresses
 * @param primaryAddress, the user's primary email address
 */
export function getNotManagedEmailAddresses(primaryAddress: string): string[] {
    return filterEmailAddresses(
        primaryAddress,
        getUserConfiguration().SessionSettings.NotManagedEmailAddresses
    );
}

/**
 * Filters out email addresses that should not be exposed to the client
 * @param primaryAddress, the user's primary email address
 * @param addresses, the email addresses to filter
 */
export function filterEmailAddresses(primaryAddress: string, addresses: readonly string[]) {
    const result: string[] = [];

    if (addresses && addresses.length > 0) {
        addresses.forEach(address => {
            if (primaryAddress != address && !shouldSkipEmailAddress(address)) {
                result.push(address);
            }
        });
    }

    return result;
}
