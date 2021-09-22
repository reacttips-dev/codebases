/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LayoutHeader_data = {
    readonly " $fragmentRefs": FragmentRefs<"ActionBar_data">;
    readonly " $refType": "LayoutHeader_data";
};
export type LayoutHeader_data$data = LayoutHeader_data;
export type LayoutHeader_data$key = {
    readonly " $data"?: LayoutHeader_data$data;
    readonly " $fragmentRefs": FragmentRefs<"LayoutHeader_data">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "teamsFeature"
        }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "LayoutHeader_data",
    "selections": [
        {
            "args": [
                {
                    "kind": "Variable",
                    "name": "teamsFeature",
                    "variableName": "teamsFeature"
                }
            ],
            "kind": "FragmentSpread",
            "name": "ActionBar_data"
        }
    ],
    "type": "RootQuery",
    "abstractKey": null
} as any;
(node as any).hash = '872efb06597aa6df0a911ebb0ab84734';
export default node;
