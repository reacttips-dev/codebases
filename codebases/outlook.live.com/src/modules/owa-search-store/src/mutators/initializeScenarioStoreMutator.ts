import getScenarioIdKey from '../utils/getScenarioIdKey';
import getStore, { createDefaultSearchStore } from '../store/store';
import { initializeScenarioStore } from '../actions/initializeScenarioStore';
import { mutator } from 'satcheljs';

mutator(initializeScenarioStore, actionMessage => {
    const scenarioIdKey = getScenarioIdKey(actionMessage.scenarioId);

    /**
     * If instance store already exists, return as its store is already
     * initialized.
     */
    if (getStore().scenarioStores.get(scenarioIdKey)) {
        return;
    }

    // Initialize instance store with default values.
    getStore().scenarioStores.set(scenarioIdKey, { ...createDefaultSearchStore() });

    const instanceStore = getStore().scenarioStores.get(scenarioIdKey);

    // Set isUsing3S value based on action message.
    instanceStore.isUsing3S = actionMessage.isUsing3S;
});
