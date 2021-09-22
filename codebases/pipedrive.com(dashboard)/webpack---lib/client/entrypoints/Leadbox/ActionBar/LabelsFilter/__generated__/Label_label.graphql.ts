/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelColor = "BLUE" | "GRAY" | "GREEN" | "PURPLE" | "RED" | "YELLOW" | "%future added value";
export type Label_label = {
    readonly colorName: LabelColor | null;
    readonly name: string;
    readonly " $refType": "Label_label";
};
export type Label_label$data = Label_label;
export type Label_label$key = {
    readonly " $data"?: Label_label$data;
    readonly " $fragmentRefs": FragmentRefs<"Label_label">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "Label_label",
    "selections": [
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
    "type": "Label",
    "abstractKey": null
} as any;
(node as any).hash = 'ada0c616c6e9a6eb644569e90a6d3709';
export default node;
