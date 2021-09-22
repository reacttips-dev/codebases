import { isFeatureEnabled } from 'owa-feature-flags';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isGetQrConnectEnabled(): boolean {
    return (
        (isFeatureEnabled('rp-emptyStateQrConnectExp1') ||
            isFeatureEnabled('rp-emptyStateQrConnectExp2')) &&
        (isConsumer() || getUserConfiguration().UserOptions.MobileAppEducationEnabled)
    );
}
