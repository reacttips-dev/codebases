import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { AutoOpenPaneId } from '../constants';

interface SuiteHeaderAutoOpenStore {
    autoOpenRegistrationMap: ObservableMap<AutoOpenPaneId, AutoOpenRegistration>;
}

export interface AutoOpenRegistration {
    /* Indicates whether the panel is eligible for auto-open */
    shouldAutoOpen: boolean;
    /* Optional override for custom auto-open behavior; if specified, consumer must handle calling the `openFlexPane` API */
    handleAutoOpen?: () => void;
}

export const getStore = createStore<SuiteHeaderAutoOpenStore>('suiteHeaderAutoOpenStore', {
    autoOpenRegistrationMap: new ObservableMap<AutoOpenPaneId, AutoOpenRegistration>(),
});
