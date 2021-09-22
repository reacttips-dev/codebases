/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type getDealPrefillDataValue = {
    readonly value: {
        readonly amount: string;
        readonly currency: {
            readonly code: string;
        };
    } | null;
    readonly " $refType": "getDealPrefillDataValue";
};
export type getDealPrefillDataValue$data = getDealPrefillDataValue;
export type getDealPrefillDataValue$key = {
    readonly " $data"?: getDealPrefillDataValue$data;
    readonly " $fragmentRefs": FragmentRefs<"getDealPrefillDataValue">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "getDealPrefillDataValue"
} as any;
(node as any).hash = 'aeddd12c00eafe58a09f3fc45330fcc2';
export default node;
