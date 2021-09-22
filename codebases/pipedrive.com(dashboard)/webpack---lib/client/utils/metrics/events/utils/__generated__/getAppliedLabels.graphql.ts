/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type getAppliedLabels = {
    readonly labels: ReadonlyArray<{
        readonly legacyID: string;
        readonly name: string;
    } | null> | null;
    readonly " $refType": "getAppliedLabels";
};
export type getAppliedLabels$data = getAppliedLabels;
export type getAppliedLabels$key = {
    readonly " $data"?: getAppliedLabels$data;
    readonly " $fragmentRefs": FragmentRefs<"getAppliedLabels">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "getAppliedLabels"
} as any;
(node as any).hash = '160287c38ad6a2be7cb7bf728504701c';
export default node;
