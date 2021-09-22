export interface IVennDataRowValue {
    Count: number;
    Value: number;
}

export interface IVennDataRow {
    [key: string]: IVennDataRowValue;
}

export enum ETabsTypes {
    ALL_TRAFFIC,
    ORGANIC,
    PAID,
}
