import { isFeatureEnabled } from 'owa-feature-flags';
import { getUserConfiguration } from 'owa-session-store';

/**
 * Checks whether feature is available in current user context
 *
 * NOTE: Eligible users with incompatible browsers (e.g. IE11) should evaluate as true,
 *       and instead will see an in-app message around browser restrictions. This is to
 *       ensure consistent feature visibility for a given user who accesses the feature
 *       across multiple browsers.
 */
export function canUseCalendarBoard(): boolean {
    return (
        isFeatureEnabled('cal-sublimity') &&
        !getUserConfiguration().SessionSettings?.IsShadowMailbox
    );
}
