import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";

export enum ESERPMetaType {
    ORGANIC = "organic",
    FEATURE = "feature",
}

export interface IRecord {
    serpFeature: string;
    currentPosition?: number;
    favicon?: string;
    innerPosition?: number;
    previousPosition?: number;
    site?: string;
    title?: string;
    url?: string;
}

export interface ISERPRecord {
    currentPosition?: number;
    previousPosition?: number;
    records?: IRecord[];
    serpFeature: string;
}

export type IRecordWithType = IRecord & { type: ESERPMetaType };
export type ISERPRecordWithType = ISERPRecord & { type: ESERPMetaType };

export type SERPSnapshotCellProps = ITableCellProps & {
    onCellClick: (event: Event, rowIndex: number) => void;
};
