import { isFeatureEnabled } from 'owa-feature-flags';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isGetMobileFeatureEnabled(): boolean {
    return (
        (isFeatureEnabled('rp-emptyStatePhoneCardQrExp') ||
            isFeatureEnabled('rp-emptyStatePhoneCardExp')) &&
        (isConsumer() || getUserConfiguration().UserOptions.MobileAppEducationEnabled)
    );
}
