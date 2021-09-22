/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelsSelectPopover_allLabels = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"LabelsSelectList_allLabels" | "LabelsSelectEdit_label">;
    readonly " $refType": "LabelsSelectPopover_allLabels";
}>;
export type LabelsSelectPopover_allLabels$data = LabelsSelectPopover_allLabels;
export type LabelsSelectPopover_allLabels$key = ReadonlyArray<{
    readonly " $data"?: LabelsSelectPopover_allLabels$data;
    readonly " $fragmentRefs": FragmentRefs<"LabelsSelectPopover_allLabels">;
}>;



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": {
        "plural": true
    },
    "name": "LabelsSelectPopover_allLabels",
    "selections": [
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
        },
        {
            "args": null,
            "kind": "FragmentSpread",
            "name": "LabelsSelectList_allLabels"
        },
        {
            "args": null,
            "kind": "FragmentSpread",
            "name": "LabelsSelectEdit_label"
        }
    ],
    "type": "Label",
    "abstractKey": null
} as any;
(node as any).hash = '15eebac8c4fdca033e21945b7176cf14';
export default node;
