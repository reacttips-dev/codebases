import getPrimaryFromAddress from './getPrimaryFromAddress';
import { isValidSmtpAddress } from 'owa-recipient-email-address/lib/utils/isValidRecipientAddress';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

/*
 * Get the default email address to send from
 * Since consumers can set the default address they send from, this may be different
 * than the address they used when initially creating the account
 */
export default function getDefaultFromAddress(): string {
    const userConfig = getUserConfiguration();
    const address = isConsumer()
        ? userConfig.SessionSettings.DefaultFromAddress
        : userConfig.UserOptions.SendAddressDefault;

    // Verify that the address is a valid SMTP address
    // If not, e.g. it is the GUID, fall back to the primary address (VSO 45276)
    return isValidSmtpAddress(address) ? address : getPrimaryFromAddress();
}
