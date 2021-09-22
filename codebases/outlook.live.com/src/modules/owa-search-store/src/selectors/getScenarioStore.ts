import getScenarioIdKey from '../utils/getScenarioIdKey';
import type { SearchScenarioId } from '../store/schema/SearchScenarioId';
import type { SearchScenarioStore } from '../store/schema/SearchStore';
import getStore, { createDefaultSearchStore } from '../store/store';

/**
 * Returns the search store instance for the given scenario ID. If no instance
 * exists for the given ID, return a default search store instance object to safely
 * handle instances that are trying to read the search store before the search
 * box mounts.
 * @param scenarioId
 */
export default function getScenarioStore(scenarioId: SearchScenarioId): SearchScenarioStore {
    return (
        getStore().scenarioStores.get(getScenarioIdKey(scenarioId)) || createDefaultSearchStore()
    );
}
