/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type getAge = {
    readonly timeCreated: string | null;
    readonly " $refType": "getAge";
};
export type getAge$data = getAge;
export type getAge$key = {
    readonly " $data"?: getAge$data;
    readonly " $fragmentRefs": FragmentRefs<"getAge">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "getAge"
} as any;
(node as any).hash = '8028621450975eea4e0ea35fbda1db58';
export default node;
