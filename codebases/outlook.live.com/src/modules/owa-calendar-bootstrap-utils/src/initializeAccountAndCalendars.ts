import { getUserConfiguration, isConsumer } from 'owa-session-store';
import { initializeAllLoadedAccounts } from 'owa-calendar-cache-loader';
import { lazyInitializeOwaAccountsStore } from 'owa-account-store-init';
import { initializeFeature } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

/**
 * Initializes accounts and calendars
 */
export default async function initializeAccountAndCalendars(): Promise<void> {
    // initialize all loaded accounts
    await initializeAllLoadedAccounts();

    // start initializing connected accounts (which will trigger post-load init logic via orchestration)
    const userConfiguration = getUserConfiguration();
    initializeFeature('cal-multiAccounts', () => {
        if (
            isHostAppFeatureEnabled('multiAccounts') &&
            !isConsumer() &&
            !userConfiguration?.SessionSettings?.IsExplicitLogon &&
            userConfiguration?.PolicySettings?.PersonalAccountCalendarsEnabled
        ) {
            lazyInitializeOwaAccountsStore.importAndExecute();
        }
    });
}
