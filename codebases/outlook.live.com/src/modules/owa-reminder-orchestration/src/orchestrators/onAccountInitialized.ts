import { orchestrator } from 'satcheljs';
import { owaConnectedAccountAdded } from 'owa-account-store-init';
import refreshReminders from '../actions/refreshReminders';
import { subscribeToConnectedAccountNotifications } from 'owa-app-notifications-core';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * starts the initial reminder load for the account that has been just initialized
 */
orchestrator(owaConnectedAccountAdded, ({ userIdentity, accountProviderType }) => {
    refreshReminders(userIdentity);
    if (
        isFeatureEnabled('auth-subscribeToConnectedAccountReminders') &&
        (accountProviderType === 'Outlook' || accountProviderType === 'Google')
    ) {
        subscribeToConnectedAccountNotifications(userIdentity, accountProviderType);
    }
});
