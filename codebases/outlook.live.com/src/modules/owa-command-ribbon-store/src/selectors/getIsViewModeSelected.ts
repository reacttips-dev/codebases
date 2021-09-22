import { default as commandRibbonStore } from '../store/store';
import type { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';

export const getIsViewModeSelected = (viewMode: CommandingViewMode): boolean => {
    return commandRibbonStore.viewMode === viewMode;
};
