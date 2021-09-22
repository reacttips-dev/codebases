/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LeadSourceIcon = "API" | "COGNISM" | "DEAL" | "IMPORT" | "LEADBOOSTER" | "LEADBOX" | "LIVE_CHAT" | "MANUALLY_CREATED" | "PROSPECTOR" | "WEBSITE_VISITORS" | "WEB_FORMS" | "WORKFLOW_AUTOMATION" | "%future added value";
export type FieldSource_data = {
    readonly leadSource: {
        readonly name: string;
        readonly iconName: LeadSourceIcon | null;
    } | null;
    readonly " $refType": "FieldSource_data";
};
export type FieldSource_data$data = FieldSource_data;
export type FieldSource_data$key = {
    readonly " $data"?: FieldSource_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldSource_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldSource_data"
} as any;
(node as any).hash = 'dc6510242cbc333705d26cbff22bb2a6';
export default node;
