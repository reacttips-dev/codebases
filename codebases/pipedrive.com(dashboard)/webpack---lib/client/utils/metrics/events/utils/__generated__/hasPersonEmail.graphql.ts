/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type hasPersonEmail = {
    readonly emails: ReadonlyArray<{
        readonly __typename: string;
    } | null> | null;
    readonly " $refType": "hasPersonEmail";
};
export type hasPersonEmail$data = hasPersonEmail;
export type hasPersonEmail$key = {
    readonly " $data"?: hasPersonEmail$data;
    readonly " $fragmentRefs": FragmentRefs<"hasPersonEmail">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "hasPersonEmail"
} as any;
(node as any).hash = '4d4c241b41424e0f63f374a65c2c7a87';
export default node;
