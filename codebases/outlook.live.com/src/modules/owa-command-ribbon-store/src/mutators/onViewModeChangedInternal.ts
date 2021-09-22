import type { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';
import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';

export const onViewModeChangedInternal = mutatorAction(
    'onViewModeChangedInternal',
    (viewMode: CommandingViewMode) => {
        getStore().viewMode = viewMode;
    }
);
