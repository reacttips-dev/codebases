import type { default as BrandList, BrandListLoadState } from './BrandList';
import type PersonaControlViewState from './PersonaControlViewState';
import type { ObservableMap } from 'mobx';

export enum LivePersonaCardInitializationState {
    NotInitialized = 'NotInitialized',
    Initializing = 'Initializing',
    Initialized = 'Initialized',
    Failed = 'Failed',
}

export enum LivePersonaEditorInitializationState {
    NotInitialized = 'NotInitialized',
    Initializing = 'Initializing',
    Initialized = 'Initialized',
    Failed = 'Failed',
}

interface PersonaControlStore {
    viewStates: ObservableMap<string, PersonaControlViewState>;
    livePersonaCardInitializationStatus: {
        state: LivePersonaCardInitializationState;
        timestamp: number;
    };
    livePersonaEditorInitializationStatus: {
        state: LivePersonaEditorInitializationState;
        timestamp: number;
    };
    // TODO: Retire isLivePersonaCardInitialized once consumers switch to livePersonaCardInitializationStatus
    isLivePersonaCardInitialized: boolean;
    isLivePersonaEditorInitialized: boolean;
    isPersonaCardDisabled: boolean;
    /**
     * Large static list of brands which is loaded on first call to
     * isEmailAddressBrand
     */
    brandList: BrandList;
    /**
     * Load state for the above brand list
     */
    brandListLoadState: BrandListLoadState;
    /**
     * Dynamic set of email addresses we know are brands that is populated at runtime.
     * Represented as map of emailAddress -> true, since mobx doesn't support observable
     * sets. See https://github.com/mobxjs/mobx/issues/69 and https://github.com/mobxjs/mobx/issues/2043
     *
     * Stored separately from the above static brand list to avoid recalculating
     * the brands smtp set.
     */
    dynamicBrandSets: {
        unverifiedBrands: ObservableMap<string, boolean>;
        verifiedBrands: ObservableMap<string, boolean>;
    };
}

export default PersonaControlStore;
