/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LeadSourceIcon = "API" | "COGNISM" | "DEAL" | "IMPORT" | "LEADBOOSTER" | "LEADBOX" | "LIVE_CHAT" | "MANUALLY_CREATED" | "PROSPECTOR" | "WEBSITE_VISITORS" | "WEB_FORMS" | "WORKFLOW_AUTOMATION" | "%future added value";
export type useSourceFilter_source = {
    readonly iconName: LeadSourceIcon | null;
    readonly " $refType": "useSourceFilter_source";
};
export type useSourceFilter_source$data = useSourceFilter_source;
export type useSourceFilter_source$key = {
    readonly " $data"?: useSourceFilter_source$data;
    readonly " $fragmentRefs": FragmentRefs<"useSourceFilter_source">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "useSourceFilter_source"
} as any;
(node as any).hash = '5be8487a83cbea46e0575246c3a4480e';
export default node;
