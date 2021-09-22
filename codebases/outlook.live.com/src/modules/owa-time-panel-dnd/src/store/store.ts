import type { TimePanelDndStore } from './schema/TimePanelDndStore';
import { createStore } from 'satcheljs';
import { createDropViewState } from 'owa-dnd';

const getStore = createStore<TimePanelDndStore>('timePanelDndStore', <TimePanelDndStore>{
    // Time Panel data state
    isTimePanelDataInitialized: false,
    // Time Panel drop state
    timePanelDropViewState: createDropViewState(),
    eventDropViewState: createDropViewState(),
    taskDropViewState: createDropViewState(),
});

export default getStore;
