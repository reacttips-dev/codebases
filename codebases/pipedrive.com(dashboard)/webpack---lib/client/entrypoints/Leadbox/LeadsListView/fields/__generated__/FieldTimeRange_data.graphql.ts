/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldTimeRange_data = {
    readonly startTime: string | null;
    readonly endTime: string | null;
    readonly " $refType": "FieldTimeRange_data";
};
export type FieldTimeRange_data$data = FieldTimeRange_data;
export type FieldTimeRange_data$key = {
    readonly " $data"?: FieldTimeRange_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldTimeRange_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldTimeRange_data"
} as any;
(node as any).hash = 'aa96046130e4e59a05a44c5bc795aa09';
export default node;
