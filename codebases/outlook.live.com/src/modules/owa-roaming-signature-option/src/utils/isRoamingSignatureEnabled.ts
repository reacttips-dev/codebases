import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function isRoamingSignatureEnabled() {
    return (
        isFeatureEnabled('cmp-roaming-signature') &&
        !getUserConfiguration().SessionSettings?.IsExplicitLogon
    );
}
