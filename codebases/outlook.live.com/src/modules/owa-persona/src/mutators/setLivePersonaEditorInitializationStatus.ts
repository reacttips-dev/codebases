import store from '../store/Store';
import { LivePersonaEditorInitializationState } from '../store/schema/PersonaControlStore';
import { default as updateLokiIsInitialized } from 'owa-people-loki/lib/mutators/updateIsInitialized';

export function setLivePersonaEditorInitializationStatus(
    newState: LivePersonaEditorInitializationState
): void {
    store.livePersonaEditorInitializationStatus = {
        state: newState,
        timestamp: Date.now(),
    };

    store.isLivePersonaEditorInitialized =
        newState === LivePersonaEditorInitializationState.Initialized;

    updateLokiIsInitialized(newState === LivePersonaEditorInitializationState.Initialized);
}
