/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LeadSourceIcon = "API" | "COGNISM" | "DEAL" | "IMPORT" | "LEADBOOSTER" | "LEADBOX" | "LIVE_CHAT" | "MANUALLY_CREATED" | "PROSPECTOR" | "WEBSITE_VISITORS" | "WEB_FORMS" | "WORKFLOW_AUTOMATION" | "%future added value";
export type SourceLabel_source = {
    readonly name: string;
    readonly iconName: LeadSourceIcon | null;
    readonly " $refType": "SourceLabel_source";
};
export type SourceLabel_source$data = SourceLabel_source;
export type SourceLabel_source$key = {
    readonly " $data"?: SourceLabel_source$data;
    readonly " $fragmentRefs": FragmentRefs<"SourceLabel_source">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SourceLabel_source",
    "selections": [
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "iconName",
            "storageKey": null
        }
    ],
    "type": "LeadSource",
    "abstractKey": null
} as any;
(node as any).hash = '2ad9705eba11cb8840307e482b046e08';
export default node;
