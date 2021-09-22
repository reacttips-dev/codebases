/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type leadDeletion_tracking = {
    readonly leadID: string;
    readonly person: {
        readonly " $fragmentRefs": FragmentRefs<"hasPersonName" | "hasPersonPhone" | "hasPersonEmail">;
    } | null;
    readonly organization: {
        readonly " $fragmentRefs": FragmentRefs<"hasOrganizationAddress" | "hasOrganizationName">;
    } | null;
    readonly labels: ReadonlyArray<{
        readonly __typename: string;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"getSource" | "getAppliedLabels">;
    readonly " $refType": "leadDeletion_tracking";
};
export type leadDeletion_tracking$data = leadDeletion_tracking;
export type leadDeletion_tracking$key = {
    readonly " $data"?: leadDeletion_tracking$data;
    readonly " $fragmentRefs": FragmentRefs<"leadDeletion_tracking">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "leadDeletion_tracking"
} as any;
(node as any).hash = 'f9cda6a2a07b41e2c95c6d1e2a577765';
export default node;
