/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type hasPersonPhone = {
    readonly phones: ReadonlyArray<{
        readonly __typename: string;
    } | null> | null;
    readonly " $refType": "hasPersonPhone";
};
export type hasPersonPhone$data = hasPersonPhone;
export type hasPersonPhone$key = {
    readonly " $data"?: hasPersonPhone$data;
    readonly " $fragmentRefs": FragmentRefs<"hasPersonPhone">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "hasPersonPhone"
} as any;
(node as any).hash = 'a31d44b62adf65af46fa9f65ecc06544';
export default node;
