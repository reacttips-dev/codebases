/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldComponent_lead = {
    readonly wasSeen: boolean | null;
    readonly " $fragmentRefs": FragmentRefs<"FieldActivity_data">;
    readonly " $refType": "FieldComponent_lead";
};
export type FieldComponent_lead$data = FieldComponent_lead;
export type FieldComponent_lead$key = {
    readonly " $data"?: FieldComponent_lead$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldComponent_lead">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldComponent_lead"
} as any;
(node as any).hash = 'de473cfa9aa82a100be07bcc4609c566';
export default node;
