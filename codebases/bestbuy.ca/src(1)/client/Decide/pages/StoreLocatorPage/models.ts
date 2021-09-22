/**
 * Models used only in the Store Locator Page.
 * TODO: refactor this with UB-60680
 */
export interface StoreHoursConfig {
    openHour: number | null;
    openMinute: number | null;
    openFormat: string | null;
    closeHour: number | null;
    closeMinute: number | null;
    closeFormat: string | null;
}

export interface WeekStoreHoursMap {
    [key: number]: StoreHoursConfig;
}

export interface PickupHoursOffset {
    openOffset: number;
    closeOffset: number;
}

export enum StoreClosedStatus {
    EN = "closed",
    FR = "fermé",
}
