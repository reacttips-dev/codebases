import { getOWAConnectedAccount } from '../selectors';
import { getDefaultLogonEmailAddress } from 'owa-session-store';
/***
 * Function that checks whether the email address belongs to the connected account
 */
export function isConnectedAccount(emailAddress: string): boolean {
    if (emailAddress == getDefaultLogonEmailAddress()) {
        return false;
    }

    const account = getOWAConnectedAccount(emailAddress);
    return account !== undefined;
}
