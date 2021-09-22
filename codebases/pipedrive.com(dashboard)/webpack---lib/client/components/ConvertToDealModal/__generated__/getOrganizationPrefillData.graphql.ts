/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type getOrganizationPrefillData = {
    readonly organization: {
        readonly address: string | null;
        readonly customFields: ReadonlyArray<{
            readonly " $fragmentRefs": FragmentRefs<"composeDealModalPrefillCustomFieldsReducer">;
        } | null> | null;
    } | null;
    readonly " $refType": "getOrganizationPrefillData";
};
export type getOrganizationPrefillData$data = getOrganizationPrefillData;
export type getOrganizationPrefillData$key = {
    readonly " $data"?: getOrganizationPrefillData$data;
    readonly " $fragmentRefs": FragmentRefs<"getOrganizationPrefillData">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "getOrganizationPrefillData"
} as any;
(node as any).hash = 'a45d85eb86b92bd03b8a9012f953f50a';
export default node;
