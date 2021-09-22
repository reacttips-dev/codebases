/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldDate_data = {
    readonly date: string | null;
    readonly " $refType": "FieldDate_data";
};
export type FieldDate_data$data = FieldDate_data;
export type FieldDate_data$key = {
    readonly " $data"?: FieldDate_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldDate_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldDate_data"
} as any;
(node as any).hash = '300feb0a7a1c2ef37eee703a12620d58';
export default node;
