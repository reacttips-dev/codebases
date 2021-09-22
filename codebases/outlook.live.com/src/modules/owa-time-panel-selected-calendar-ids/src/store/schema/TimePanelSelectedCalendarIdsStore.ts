import type { ObservableMap } from 'mobx';

export enum ConfigLoadState {
    /** Time Panel config successfully loaded from server */
    Loaded,
    /** Time Panel config failed to load from server */
    Failed,
}

export interface TimePanelSelectedCalendarIdsStore {
    /** Map of accounts (by userIdentity) to Time Panel config load state */
    configLoadStates: ObservableMap<string, ConfigLoadState>;
    /** Map of accounts (by userIdentity) to a list of selected calendarIds; only populated once user has started making edits in Time Panel calendar picker */
    calendarIdsMap: ObservableMap<string, string[]>;
}

export default TimePanelSelectedCalendarIdsStore;
