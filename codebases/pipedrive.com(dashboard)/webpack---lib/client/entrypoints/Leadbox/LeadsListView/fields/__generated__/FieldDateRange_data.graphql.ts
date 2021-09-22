/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldDateRange_data = {
    readonly startDate: string | null;
    readonly endDate: string | null;
    readonly " $refType": "FieldDateRange_data";
};
export type FieldDateRange_data$data = FieldDateRange_data;
export type FieldDateRange_data$key = {
    readonly " $data"?: FieldDateRange_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldDateRange_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldDateRange_data"
} as any;
(node as any).hash = '553c9a1d7905534a23f28bb50e9a5bc9';
export default node;
