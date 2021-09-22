/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type hasOrganizationName = {
    readonly name: string | null;
    readonly " $refType": "hasOrganizationName";
};
export type hasOrganizationName$data = hasOrganizationName;
export type hasOrganizationName$key = {
    readonly " $data"?: hasOrganizationName$data;
    readonly " $fragmentRefs": FragmentRefs<"hasOrganizationName">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "hasOrganizationName"
} as any;
(node as any).hash = '1e33992d917714d9247e30df7df3967b';
export default node;
