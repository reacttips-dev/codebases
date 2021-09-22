import type { PanelView } from '../store/schema/TimePanelSettingsStore';
import type { TimePanelSelectedViewType } from 'owa-scenario-settings';

const panelViewToTypeMapping: { [T in PanelView]: TimePanelSelectedViewType } = {
    Conflicts: 'Calendar',
    EventDetails: 'Calendar',
    AttendeeTracking: 'Calendar',
    Calendar: 'Calendar',
    ComposeForm: 'Calendar',
    Tasks: 'Tasks',
    TaskDetails: 'Tasks',
};

export function getPanelViewType(view: PanelView): TimePanelSelectedViewType {
    if (!view) {
        return null;
    }
    return panelViewToTypeMapping[view];
}
