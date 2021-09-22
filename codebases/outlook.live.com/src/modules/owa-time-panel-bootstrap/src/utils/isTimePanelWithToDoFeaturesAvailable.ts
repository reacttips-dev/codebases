import { isTimePanelAvailable } from './isTimePanelAvailable';
import { isSupportedViewForUser } from 'owa-time-panel-settings/lib/utils/isSupportedViewForUser';

/**
 * Checks whether Time Panel feature is available in current OWA user/window context,
 * as well as whether To Do functionality is available within Time Panel.
 *
 * OWA features that interact with Time Panel and require To Do functionality should
 * be hidden or disabled when these features are not available.
 */
export function isTimePanelWithToDoFeaturesAvailable(): boolean {
    return isTimePanelAvailable() && isSupportedViewForUser('Tasks');
}
