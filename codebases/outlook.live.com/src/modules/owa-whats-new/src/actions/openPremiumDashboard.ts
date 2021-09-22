import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyMountAndShowFullOptions } from 'owa-options-view';

const upgradeUrl = 'https://premium.outlook.com';

// Orchestrator for this action is inside owa-mail which opens the premium dashboard
export function openPremiumDashboard() {
    if (isFeatureEnabled('auth-PremiumDashboardApril')) {
        lazyMountAndShowFullOptions.importAndExecute('premium', 'features');
    } else if (isFeatureEnabled('auth-PremiumDashboard')) {
        lazyMountAndShowFullOptions.importAndExecute('general', 'Premium');
    } else {
        window.open(upgradeUrl, '_blank');
    }
}
