/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldTime_data = {
    readonly time: string | null;
    readonly " $refType": "FieldTime_data";
};
export type FieldTime_data$data = FieldTime_data;
export type FieldTime_data$key = {
    readonly " $data"?: FieldTime_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldTime_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldTime_data"
} as any;
(node as any).hash = '5c70af2f8df17bacc5e558e36d7de56c';
export default node;
