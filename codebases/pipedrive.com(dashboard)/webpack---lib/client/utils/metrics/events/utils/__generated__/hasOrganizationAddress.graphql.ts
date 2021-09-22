/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type hasOrganizationAddress = {
    readonly address: string | null;
    readonly " $refType": "hasOrganizationAddress";
};
export type hasOrganizationAddress$data = hasOrganizationAddress;
export type hasOrganizationAddress$key = {
    readonly " $data"?: hasOrganizationAddress$data;
    readonly " $fragmentRefs": FragmentRefs<"hasOrganizationAddress">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "hasOrganizationAddress"
} as any;
(node as any).hash = 'f6c6cc25026b42b244bbbd584e0e6603';
export default node;
