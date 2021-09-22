import { isFeatureEnabled } from 'owa-feature-flags';

export default function isNewDefaultCharmIconEnabled() {
    return (
        isFeatureEnabled('mon-cal-NewDefaultCharmIcon') ||
        isFeatureEnabled('mon-cal-charmAndCalendarIconSDF')
    );
}
