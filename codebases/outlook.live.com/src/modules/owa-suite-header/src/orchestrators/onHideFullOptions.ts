import { hideFullOptions } from 'owa-options-core/lib/actions/publicActions';
import { updateHeaderButtonState } from 'owa-suite-header-apis';
import { orchestrator } from 'satcheljs';
import { isFeatureEnabled } from 'owa-feature-flags';
import { OwaPremiumButtonID } from '../constants';

orchestrator(hideFullOptions, () => {
    if (
        isFeatureEnabled('auth-PremiumDashboardApril') ||
        isFeatureEnabled('auth-PremiumDashboard')
    ) {
        updateHeaderButtonState(OwaPremiumButtonID, false);
    }
});
