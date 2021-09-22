/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LeadSourceIcon = "API" | "COGNISM" | "DEAL" | "IMPORT" | "LEADBOOSTER" | "LEADBOX" | "LIVE_CHAT" | "MANUALLY_CREATED" | "PROSPECTOR" | "WEBSITE_VISITORS" | "WEB_FORMS" | "WORKFLOW_AUTOMATION" | "%future added value";
export type useSourceFilter_data = {
    readonly leadSources: ReadonlyArray<{
        readonly id: string;
        readonly name: string;
        readonly iconName: LeadSourceIcon | null;
        readonly " $fragmentRefs": FragmentRefs<"useSourceFilter_source" | "SourceLabel_source">;
    } | null> | null;
    readonly " $refType": "useSourceFilter_data";
};
export type useSourceFilter_data$data = useSourceFilter_data;
export type useSourceFilter_data$key = {
    readonly " $data"?: useSourceFilter_data$data;
    readonly " $fragmentRefs": FragmentRefs<"useSourceFilter_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "useSourceFilter_data"
} as any;
(node as any).hash = 'ed9836130862ed0458a0de03164bd672';
export default node;
