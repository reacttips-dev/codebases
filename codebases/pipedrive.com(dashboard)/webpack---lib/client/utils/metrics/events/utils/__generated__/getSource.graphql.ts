/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type getSource = {
    readonly sourceInfo: {
        readonly source: {
            readonly name: string;
        } | null;
    } | null;
    readonly " $refType": "getSource";
};
export type getSource$data = getSource;
export type getSource$key = {
    readonly " $data"?: getSource$data;
    readonly " $fragmentRefs": FragmentRefs<"getSource">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "getSource"
} as any;
(node as any).hash = '129cc4c3d93b5c7d19b158e58119f92d';
export default node;
