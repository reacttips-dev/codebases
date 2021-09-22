import { getUserConfiguration, isPremiumConsumer } from 'owa-session-store';
import { isEdu } from 'owa-nonboot-userconfiguration-manager';
import { isFeatureEnabled } from 'owa-feature-flags';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export default function isOutlookSpacesEnabled() {
    const enabledByFeatureFlag = isFeatureEnabled('outlookSpaces-enabled');
    const { SessionSettings = {}, PolicySettings } = getUserConfiguration();
    if (!isHostAppFeatureEnabled('spacesEnabled')) {
        return false;
    }
    switch (SessionSettings.WebSessionType) {
        case WebSessionType.Business:
            const canEnableByPolicyFlag = isFeatureEnabled('outlookSpaces-canEnableByPolicy');
            const canEnableByPolicy = canEnableByPolicyFlag || isEdu();
            const policySettings = PolicySettings || {};
            const enabledByPolicy = !!policySettings.ProjectMocaEnabled;
            return enabledByFeatureFlag || (canEnableByPolicy && enabledByPolicy);
        case WebSessionType.ExoConsumer:
            const isPremium = isPremiumConsumer();
            const isFreeEnabled = isFeatureEnabled('outlookSpaces-free-consumer-enabled');
            return enabledByFeatureFlag && (isPremium || isFreeEnabled);
        case WebSessionType.GMail:
            return enabledByFeatureFlag && isFeatureEnabled('outlookSpaces-gmail-enabled');
        default:
            return false;
    }
}
