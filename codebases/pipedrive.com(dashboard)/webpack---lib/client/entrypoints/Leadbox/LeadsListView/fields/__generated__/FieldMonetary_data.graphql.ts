/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldMonetary_data = {
    readonly monetary: {
        readonly amount: string;
        readonly currency: {
            readonly code: string;
        };
    } | null;
    readonly " $refType": "FieldMonetary_data";
};
export type FieldMonetary_data$data = FieldMonetary_data;
export type FieldMonetary_data$key = {
    readonly " $data"?: FieldMonetary_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldMonetary_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldMonetary_data"
} as any;
(node as any).hash = '52691aeecb34a885fc2408c9533c335b';
export default node;
