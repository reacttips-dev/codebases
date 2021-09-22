import { isFeatureEnabled } from 'owa-feature-flags';

export default function isInteractiveFiltersEnabled(): boolean {
    return (
        isFeatureEnabled('sea-interactiveFiltersAll') ||
        isFeatureEnabled('sea-interactiveFiltersUnreadTime')
    );
}
