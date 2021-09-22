/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LayoutHeader_leadView = {
    readonly " $fragmentRefs": FragmentRefs<"ActionBar_leadView">;
    readonly " $refType": "LayoutHeader_leadView";
};
export type LayoutHeader_leadView$data = LayoutHeader_leadView;
export type LayoutHeader_leadView$key = {
    readonly " $data"?: LayoutHeader_leadView$data;
    readonly " $fragmentRefs": FragmentRefs<"LayoutHeader_leadView">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LayoutHeader_leadView",
    "selections": [
        {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ActionBar_leadView"
        }
    ],
    "type": "LeadTableConnection",
    "abstractKey": null
} as any;
(node as any).hash = '4d4119937d737c4ca15db3e6d1794f5d';
export default node;
