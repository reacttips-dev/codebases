import store from '../store/Store';
import { LivePersonaCardInitializationState } from '../store/schema/PersonaControlStore';
import { default as updateLokiIsInitialized } from 'owa-people-loki/lib/mutators/updateIsInitialized';

export function setLivePersonaCardInitializationStatus(
    newState: LivePersonaCardInitializationState
): void {
    store.livePersonaCardInitializationStatus = {
        state: newState,
        timestamp: Date.now(),
    };

    store.isLivePersonaCardInitialized =
        newState === LivePersonaCardInitializationState.Initialized;

    updateLokiIsInitialized(newState === LivePersonaCardInitializationState.Initialized);
}
