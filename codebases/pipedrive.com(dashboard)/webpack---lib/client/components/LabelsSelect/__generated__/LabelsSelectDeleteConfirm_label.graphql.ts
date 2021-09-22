/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelsSelectDeleteConfirm_label = {
    readonly legacyLabelID: string;
    readonly " $refType": "LabelsSelectDeleteConfirm_label";
};
export type LabelsSelectDeleteConfirm_label$data = LabelsSelectDeleteConfirm_label;
export type LabelsSelectDeleteConfirm_label$key = {
    readonly " $data"?: LabelsSelectDeleteConfirm_label$data;
    readonly " $fragmentRefs": FragmentRefs<"LabelsSelectDeleteConfirm_label">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LabelsSelectDeleteConfirm_label",
    "selections": [
        {
            "alias": "legacyLabelID",
            "args": [
                {
                    "kind": "Literal",
                    "name": "opaque",
                    "value": false
                }
            ],
            "kind": "ScalarField",
            "name": "id",
            "storageKey": "id(opaque:false)"
        }
    ],
    "type": "Label",
    "abstractKey": null
} as any;
(node as any).hash = 'a5522389b6d37af67dff097cf68a08e2';
export default node;
