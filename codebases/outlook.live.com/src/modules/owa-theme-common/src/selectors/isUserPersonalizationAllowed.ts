import { getUserConfiguration } from 'owa-session-store';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export function isUserPersonalizationAllowed(): boolean {
    const userConfiguration = getUserConfiguration();
    return (
        !!userConfiguration?.SegmentationSettings?.Themes &&
        (isConsumer() || userConfiguration.TenantThemeData?.UserPersonalizationAllowed !== false)
    );
}
