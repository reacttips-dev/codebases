/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type ActionBar_leadView = {
    readonly " $fragmentRefs": FragmentRefs<"ActionBarAddLead_leadView">;
    readonly " $refType": "ActionBar_leadView";
};
export type ActionBar_leadView$data = ActionBar_leadView;
export type ActionBar_leadView$key = {
    readonly " $data"?: ActionBar_leadView$data;
    readonly " $fragmentRefs": FragmentRefs<"ActionBar_leadView">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ActionBar_leadView",
    "selections": [
        {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ActionBarAddLead_leadView"
        }
    ],
    "type": "LeadTableConnection",
    "abstractKey": null
} as any;
(node as any).hash = '1e8b23a3e58ce1419c461e9cee9be642';
export default node;
