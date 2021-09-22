/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type hasPersonName = {
    readonly name: string | null;
    readonly " $refType": "hasPersonName";
};
export type hasPersonName$data = hasPersonName;
export type hasPersonName$key = {
    readonly " $data"?: hasPersonName$data;
    readonly " $fragmentRefs": FragmentRefs<"hasPersonName">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "hasPersonName"
} as any;
(node as any).hash = '6eda82bf13101d371e58946027ad8629';
export default node;
