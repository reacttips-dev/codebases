import { action } from 'satcheljs';
import type { SearchScenarioId } from '../store/schema/SearchScenarioId';

export const initializeScenarioStore = action(
    'INITIALIZE_SCENARIO_STORE',
    (scenarioId: SearchScenarioId, isUsing3S: boolean) => ({
        scenarioId,
        isUsing3S,
    })
);
