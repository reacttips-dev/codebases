/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type ActionBar_data = {
    readonly inboxCount: number | null;
    readonly archivedCount: number | null;
    readonly " $fragmentRefs": FragmentRefs<"ActionBarAddLead_data">;
    readonly " $refType": "ActionBar_data";
};
export type ActionBar_data$data = ActionBar_data;
export type ActionBar_data$key = {
    readonly " $data"?: ActionBar_data$data;
    readonly " $fragmentRefs": FragmentRefs<"ActionBar_data">;
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
    "name": "ActionBar_data",
    "selections": [
        {
            "alias": "inboxCount",
            "args": [
                {
                    "kind": "Literal",
                    "name": "page",
                    "value": "INBOX"
                }
            ],
            "kind": "ScalarField",
            "name": "leadsCount",
            "storageKey": "leadsCount(page:\"INBOX\")"
        },
        {
            "alias": "archivedCount",
            "args": [
                {
                    "kind": "Literal",
                    "name": "page",
                    "value": "ARCHIVE"
                }
            ],
            "kind": "ScalarField",
            "name": "leadsCount",
            "storageKey": "leadsCount(page:\"ARCHIVE\")"
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
            "name": "ActionBarAddLead_data"
        }
    ],
    "type": "RootQuery",
    "abstractKey": null
} as any;
(node as any).hash = '5c62ab0d7f48fff58f0736a99afa6bc8';
export default node;
