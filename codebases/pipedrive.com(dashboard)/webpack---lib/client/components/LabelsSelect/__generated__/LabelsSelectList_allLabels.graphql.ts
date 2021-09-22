/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelsSelectList_allLabels = ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly " $fragmentRefs": FragmentRefs<"LabelsSelectOption_label">;
    readonly " $refType": "LabelsSelectList_allLabels";
}>;
export type LabelsSelectList_allLabels$data = LabelsSelectList_allLabels;
export type LabelsSelectList_allLabels$key = ReadonlyArray<{
    readonly " $data"?: LabelsSelectList_allLabels$data;
    readonly " $fragmentRefs": FragmentRefs<"LabelsSelectList_allLabels">;
}>;



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": {
        "plural": true
    },
    "name": "LabelsSelectList_allLabels",
    "selections": [
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
        },
        {
            "args": null,
            "kind": "FragmentSpread",
            "name": "LabelsSelectOption_label"
        }
    ],
    "type": "Label",
    "abstractKey": null
} as any;
(node as any).hash = 'a6182095a3ee9ae37bbb6d05fc7742ea';
export default node;
