import { getPanelViewType } from './getPanelViewType';
import type { PanelView } from '../store/schema/TimePanelSettingsStore';
import { getTimePanelConfig } from 'owa-time-panel-config';
import { canUseToDoFeatures } from 'owa-todo-utils/lib/utils/moduleAccessUtils';

export function isSupportedViewForUser(view: PanelView) {
    if (getPanelViewType(view) === 'Tasks') {
        return canUseToDoFeatures() && !getTimePanelConfig().isTasksViewDisabled;
    }
    return true;
}
