import { HeaderHeight } from 'owa-flex-pane/lib/components/FlexPaneVariables';
import { canUseToDoFeatures } from 'owa-todo-utils/lib/utils/moduleAccessUtils';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import type { TimePanelConfig } from '../schema/TimePanelConfig';

// initialize with default values for OWA core modules
let timePanelConfig: TimePanelConfig = {
    abovePanelHeight: HeaderHeight,
    // for Calendar module, default to 'Tasks' for better companion experience
    // evaluation is not deferred, as this is an edge-case optimization only applicable to first-time pane users who do not have a persisted setting
    initialPanelView:
        getOwaWorkload() === OwaWorkload.Calendar && canUseToDoFeatures() ? 'Tasks' : 'Calendar',
    initialCalendarView: 'Agenda',
    areFREsDisabled: false,
    // for non-Calendar modules, leverage inline compose over full compose
    // evaluation is deferred to ensure the right compose experience is triggered in case of module-switching
    isInlineComposeEnabled: () => getOwaWorkload() != OwaWorkload.Calendar,
    isClosePaneButtonEnabled: false,
    isTasksViewDisabled: false,
    isModuleDeeplinkDisabled: false,
};

export function initializeTimePanelConfig(customConfig: TimePanelConfig) {
    timePanelConfig = { ...customConfig };
}

export function getTimePanelConfig(): TimePanelConfig {
    return timePanelConfig;
}
