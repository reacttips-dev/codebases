import { getOWAConnectedAccounts, isConnectedAccount } from 'owa-accounts-store';
import { isConsumer } from 'owa-session-store';
import { isWorkViewEnabled, isLifeViewEnabled } from './readWorkLifeViewOption';

export function isWorkLifeViewEnabledForUser(userIdentity: string): boolean {
    if (isConsumer() || getOWAConnectedAccounts().length == 0) {
        // always return true if this a consumer scenario or if this enterprise scenario with no connected accounts
        return true;
    } else {
        return (
            ((!isConnectedAccount(userIdentity) && isWorkViewEnabled()) ||
                (isConnectedAccount(userIdentity) && isLifeViewEnabled())) > 0
        );
    }
}
