/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type getDealAddedTrackingData_lead = {
    readonly internalID: string;
    readonly person: {
        readonly " $fragmentRefs": FragmentRefs<"hasPersonName" | "hasPersonPhone" | "hasPersonEmail">;
    } | null;
    readonly organization: {
        readonly " $fragmentRefs": FragmentRefs<"hasOrganizationName" | "hasOrganizationAddress">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"getAge" | "getSource">;
    readonly " $refType": "getDealAddedTrackingData_lead";
};
export type getDealAddedTrackingData_lead$data = getDealAddedTrackingData_lead;
export type getDealAddedTrackingData_lead$key = {
    readonly " $data"?: getDealAddedTrackingData_lead$data;
    readonly " $fragmentRefs": FragmentRefs<"getDealAddedTrackingData_lead">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "getDealAddedTrackingData_lead"
} as any;
(node as any).hash = 'a273d5dd7ae2d8cb5193447ca751d888';
export default node;
