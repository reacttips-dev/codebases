/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type ActionBarAddLead_leadView = {
    readonly totalCount: number | null;
    readonly " $refType": "ActionBarAddLead_leadView";
};
export type ActionBarAddLead_leadView$data = ActionBarAddLead_leadView;
export type ActionBarAddLead_leadView$key = {
    readonly " $data"?: ActionBarAddLead_leadView$data;
    readonly " $fragmentRefs": FragmentRefs<"ActionBarAddLead_leadView">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ActionBarAddLead_leadView",
    "selections": [
        {
            "alias": "totalCount",
            "args": null,
            "kind": "ScalarField",
            "name": "count",
            "storageKey": null
        }
    ],
    "type": "LeadTableConnection",
    "abstractKey": null
} as any;
(node as any).hash = '985ed5186b9bcf9bc820fc54106e4c37';
export default node;
