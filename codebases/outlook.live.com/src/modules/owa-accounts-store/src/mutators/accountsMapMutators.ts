import {
    addOWAConnectedAccount,
    removeOWAConnectedAccount,
    updateOWAConnectedAccountToken,
    updateOWAConnectedAccountStatus,
} from '../actions';
import { mutator } from 'satcheljs';
import getStore from '../store/store';
import { addSeconds, now } from 'owa-datetime';
import { logUsage } from 'owa-analytics';
import { OWAConnectedAccountState } from '../store/schema/OWAConnectedAccount';

mutator(addOWAConnectedAccount, ({ account }) => {
    logUsage('owaAccountAdded', {
        accountStatus_1: OWAConnectedAccountState[account.accountState],
    });
    getStore().accountsMap.set(account.userIdentity, account);
});

mutator(removeOWAConnectedAccount, ({ userIdentity: userIdentity }) => {
    getStore().accountsMap.delete(userIdentity);
});

mutator(
    updateOWAConnectedAccountToken,
    ({
        userIdentity: userIdentity,
        accountToken: accountToken,
        accountTokenExpiresIn: accountTokenExpiresIn,
    }) => {
        const connectedAccount = getStore().accountsMap.get(userIdentity);
        connectedAccount.token = accountToken;
        connectedAccount.tokenExpiry = addSeconds(now(), accountTokenExpiresIn);
    }
);

mutator(
    updateOWAConnectedAccountStatus,
    ({ userIdentity: userIdentity, accountState: accountState }) => {
        const connectedAccount = getStore().accountsMap.get(userIdentity);
        if (
            connectedAccount.accountState == OWAConnectedAccountState.Valid &&
            accountState != OWAConnectedAccountState.Valid
        ) {
            // datapoint to help us track how many times accounts get in to invalid state
            logUsage('owaConnectedAccountStatusUpdated', {
                accountStatus_1: OWAConnectedAccountState[accountState],
            });
        }
        connectedAccount.accountState = accountState;
    }
);
