/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelColor = "BLUE" | "GRAY" | "GREEN" | "PURPLE" | "RED" | "YELLOW" | "%future added value";
export type BulkEditLabels_data = {
    readonly labels: ReadonlyArray<{
        readonly id: string;
        readonly colorName: LabelColor | null;
        readonly name: string;
    } | null> | null;
    readonly " $refType": "BulkEditLabels_data";
};
export type BulkEditLabels_data$data = BulkEditLabels_data;
export type BulkEditLabels_data$key = {
    readonly " $data"?: BulkEditLabels_data$data;
    readonly " $fragmentRefs": FragmentRefs<"BulkEditLabels_data">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BulkEditLabels_data",
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
                    "name": "colorName",
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
                    "storageKey": null
                }
            ],
            "storageKey": null
        }
    ],
    "type": "RootQuery",
    "abstractKey": null
} as any;
(node as any).hash = '3955578bded8e69f7afbbfae2bdcbc8a';
export default node;
