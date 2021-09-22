/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelsFilter_data = {
    readonly labels: ReadonlyArray<{
        readonly id: string;
        readonly name: string;
        readonly " $fragmentRefs": FragmentRefs<"LabelsSelectPopover_allLabels" | "Label_label">;
    } | null> | null;
    readonly " $refType": "LabelsFilter_data";
};
export type LabelsFilter_data$data = LabelsFilter_data;
export type LabelsFilter_data$key = {
    readonly " $data"?: LabelsFilter_data$data;
    readonly " $fragmentRefs": FragmentRefs<"LabelsFilter_data">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LabelsFilter_data",
    "selections": [
        {
            "alias": null,
            "args": null,
            "concreteType": "Label",
            "kind": "LinkedField",
            "name": "labels",
            "plural": true,
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
                    "name": "LabelsSelectPopover_allLabels"
                },
                {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "Label_label"
                }
            ],
            "storageKey": null
        }
    ],
    "type": "RootQuery",
    "abstractKey": null
} as any;
(node as any).hash = 'a4741e7fb2ae5a30f0be28151c9178bf';
export default node;
