import type {
    default as ConflictsViewState,
    ConflictsViewScenario,
} from './schema/ConflictsViewState';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const supportedScenarios: ConflictsViewScenario[] = ['TimePanelConflictsView', 'RSVPPeek'];

const getStore = createStore<ObservableMap<ConflictsViewScenario, ConflictsViewState>>(
    'ConflictsViewStore',
    new ObservableMap<ConflictsViewScenario, ConflictsViewState>(
        supportedScenarios.map<[ConflictsViewScenario, ConflictsViewState]>(scenario => [
            scenario,
            { meetingRequest: null, futureInstances: [], selectedInstanceIndex: 0 },
        ])
    )
);

export default getStore;
