import { saveCommandingOptions } from './saveCommandingOptions';
import type { CommandingViewMode } from 'owa-outlook-service-options';

export function saveCommandingViewModeOption(viewMode: CommandingViewMode) {
    saveCommandingOptions({ viewMode });
}
