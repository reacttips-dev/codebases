import { getAccountCalendarIds } from '../selectors/getAccountCalendarIds';
import { getUserMailboxInfo } from 'owa-client-ids';
import { getDefaultConnectedAccount } from 'owa-accounts-store';

export function getAccountFromCalendarId(calendarId: string): string {
    const primaryCalendarIds = getAccountCalendarIds(getUserMailboxInfo().userIdentity);
    if (primaryCalendarIds.includes(calendarId)) {
        return getUserMailboxInfo().userIdentity;
    } else {
        const connectedAccount = getDefaultConnectedAccount();
        const connectedAccountCalendarIds = getAccountCalendarIds(connectedAccount.userIdentity);
        if (connectedAccountCalendarIds.includes(calendarId)) {
            return connectedAccount.userIdentity;
        }
    }
    return null;
}
