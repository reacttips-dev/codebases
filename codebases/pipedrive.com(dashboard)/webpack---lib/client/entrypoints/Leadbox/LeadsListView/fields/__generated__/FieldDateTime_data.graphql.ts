/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldDateTime_data = {
    readonly dateTime: string | null;
    readonly " $refType": "FieldDateTime_data";
};
export type FieldDateTime_data$data = FieldDateTime_data;
export type FieldDateTime_data$key = {
    readonly " $data"?: FieldDateTime_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldDateTime_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldDateTime_data"
} as any;
(node as any).hash = 'a3002b843cce6932a21d19b1064605d7';
export default node;
