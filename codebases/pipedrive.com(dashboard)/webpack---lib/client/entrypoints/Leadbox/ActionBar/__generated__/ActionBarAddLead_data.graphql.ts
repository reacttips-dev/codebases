/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type ActionBarAddLead_data = {
    readonly " $fragmentRefs": FragmentRefs<"SourceFilter_data" | "LabelsFilter_data" | "GlobalFilter_data">;
    readonly " $refType": "ActionBarAddLead_data";
};
export type ActionBarAddLead_data$data = ActionBarAddLead_data;
export type ActionBarAddLead_data$key = {
    readonly " $data"?: ActionBarAddLead_data$data;
    readonly " $fragmentRefs": FragmentRefs<"ActionBarAddLead_data">;
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
    "name": "ActionBarAddLead_data",
    "selections": [
        {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SourceFilter_data"
        },
        {
            "args": null,
            "kind": "FragmentSpread",
            "name": "LabelsFilter_data"
        },
        {
            "args": [
                {
                    "kind": "Variable",
                    "name": "teamsFeature",
                    "variableName": "teamsFeature"
                }
            ],
            "kind": "FragmentSpread",
            "name": "GlobalFilter_data"
        }
    ],
    "type": "RootQuery",
    "abstractKey": null
} as any;
(node as any).hash = '4793d33789f4aff37caf46e7e1581c87';
export default node;
