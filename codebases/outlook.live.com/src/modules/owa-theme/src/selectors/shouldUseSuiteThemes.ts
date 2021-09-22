import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export function shouldUseSuiteThemes(): boolean {
    return isFeatureEnabled('fwk-suiteThemes') && !isHostAppFeatureEnabled('useBaseTheme');
}
