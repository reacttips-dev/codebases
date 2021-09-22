import type { TimePanelStore } from './schema/TimePanelStore';
import { createStore } from 'satcheljs';

let getStore = createStore<TimePanelStore>('timePanelStore', <TimePanelStore>{
    // telemetry
    sessionId: '',
    panelOpenTimestamp: null,
    panelViewOpenTimestamp: null,
    // business logic
    source: null,
    isPanelInitialized: false,
    isPanelOpen: false,
    selectedCalendarItemId: null,
    selectedTaskId: null,
});

export default getStore;
