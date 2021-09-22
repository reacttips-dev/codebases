import { default as commandRibbonStore } from '../store/store';
import { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';

export const getInRibbonMode = (): boolean => {
    const mode = commandRibbonStore.viewMode;
    return (
        mode === CommandingViewMode.MultiLineRibbon || mode === CommandingViewMode.SingleLineRibbon
    );
};
