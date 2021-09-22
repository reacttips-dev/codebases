import PersonaControlStore, {
    LivePersonaCardInitializationState,
    LivePersonaEditorInitializationState,
} from './schema/PersonaControlStore';
import type PersonaControlViewState from './schema/PersonaControlViewState';
import { BrandListLoadState } from './schema/BrandList';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

var initialPersonaControlStore: PersonaControlStore = {
    viewStates: new ObservableMap<string, PersonaControlViewState>(),
    livePersonaCardInitializationStatus: {
        state: LivePersonaCardInitializationState.NotInitialized,
        timestamp: Date.now(),
    },
    livePersonaEditorInitializationStatus: {
        state: LivePersonaEditorInitializationState.NotInitialized,
        timestamp: Date.now(),
    },
    isLivePersonaCardInitialized: false,
    isLivePersonaEditorInitialized: false,
    isPersonaCardDisabled: false,
    brandList: null,
    brandListLoadState: BrandListLoadState.unloaded,
    dynamicBrandSets: {
        unverifiedBrands: new ObservableMap(),
        verifiedBrands: new ObservableMap(),
    },
};
var store = createStore<PersonaControlStore>('personacontrol', initialPersonaControlStore)();

export default store;
