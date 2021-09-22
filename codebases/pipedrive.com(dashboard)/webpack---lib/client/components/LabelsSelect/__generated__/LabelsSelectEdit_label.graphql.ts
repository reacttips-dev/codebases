/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelColor = "BLUE" | "GRAY" | "GREEN" | "PURPLE" | "RED" | "YELLOW" | "%future added value";
export type LabelsSelectEdit_label = {
    readonly id: string;
    readonly name: string;
    readonly colorName: LabelColor | null;
    readonly " $fragmentRefs": FragmentRefs<"LabelsSelectDeleteConfirm_label">;
    readonly " $refType": "LabelsSelectEdit_label";
};
export type LabelsSelectEdit_label$data = LabelsSelectEdit_label;
export type LabelsSelectEdit_label$key = {
    readonly " $data"?: LabelsSelectEdit_label$data;
    readonly " $fragmentRefs": FragmentRefs<"LabelsSelectEdit_label">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LabelsSelectEdit_label",
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "colorName",
            "storageKey": null
        },
        {
            "args": null,
            "kind": "FragmentSpread",
            "name": "LabelsSelectDeleteConfirm_label"
        }
    ],
    "type": "Label",
    "abstractKey": null
} as any;
(node as any).hash = 'a04b213099a7ed1c27f552ea13a88d71';
export default node;
