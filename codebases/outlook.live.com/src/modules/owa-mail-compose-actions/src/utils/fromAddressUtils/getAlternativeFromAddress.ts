import { getAliasAddresses } from './getAllFromAddresses';
import getDefaultFromAddress from './getDefaultFromAddress';
import getPrimaryFromAddress from './getPrimaryFromAddress';
import shouldSkipEmailAddress from './shouldSkipEmailAddress';

/**
 * Gets the alternative from address, i.e. when a user has more than one address to send from
 */
// TODO: Parse through SharingInstanceGuid to determine what connected account info to use (VSO:29460)
export default function getAlternativeFromAddress(): string {
    const defaultFromAddress = getDefaultFromAddress();
    const primaryAddress = getPrimaryFromAddress();
    if (primaryAddress === defaultFromAddress && shouldSkipEmailAddress(defaultFromAddress)) {
        const aliases = getAliasAddresses(primaryAddress, true /* includeProxyAddressesForEnt */);
        if (aliases && aliases.length > 0) {
            return aliases[0];
        }
    }

    return defaultFromAddress;
}
