/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldMultipleOptions_data = {
    readonly selectedOptions: ReadonlyArray<{
        readonly id: string;
        readonly label: string | null;
    }> | null;
    readonly " $refType": "FieldMultipleOptions_data";
};
export type FieldMultipleOptions_data$data = FieldMultipleOptions_data;
export type FieldMultipleOptions_data$key = {
    readonly " $data"?: FieldMultipleOptions_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldMultipleOptions_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldMultipleOptions_data"
} as any;
(node as any).hash = '3785d99d8ab2978540b59b26a0db239e';
export default node;
