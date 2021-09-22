/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelColor = "BLUE" | "GRAY" | "GREEN" | "PURPLE" | "RED" | "YELLOW" | "%future added value";
export type LabelsSelectOption_label = {
    readonly id: string;
    readonly name: string;
    readonly colorName: LabelColor | null;
    readonly " $refType": "LabelsSelectOption_label";
};
export type LabelsSelectOption_label$data = LabelsSelectOption_label;
export type LabelsSelectOption_label$key = {
    readonly " $data"?: LabelsSelectOption_label$data;
    readonly " $fragmentRefs": FragmentRefs<"LabelsSelectOption_label">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LabelsSelectOption_label",
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
        }
    ],
    "type": "Label",
    "abstractKey": null
} as any;
(node as any).hash = 'f2152cddf9d30a3f75fad3204abb4e42';
export default node;
