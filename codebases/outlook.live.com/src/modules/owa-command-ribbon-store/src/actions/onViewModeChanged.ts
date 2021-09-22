import { action } from 'satcheljs';
import type { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';

export const onViewModeChanged = action('onViewModeChanged', (viewMode: CommandingViewMode) => ({
    viewMode,
}));
