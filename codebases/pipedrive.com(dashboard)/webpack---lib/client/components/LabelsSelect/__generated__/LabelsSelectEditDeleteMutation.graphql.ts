/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type LabelsSelectEditDeleteMutationVariables = {
    labelID: string;
};
export type LabelsSelectEditDeleteMutationResponse = {
    readonly deleteLabel: ({
        readonly __typename: "Label";
        readonly id: string;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type LabelsSelectEditDeleteMutation = {
    readonly response: LabelsSelectEditDeleteMutationResponse;
    readonly variables: LabelsSelectEditDeleteMutationVariables;
};



/*
mutation LabelsSelectEditDeleteMutation(
  $labelID: ID!
) {
  deleteLabel(id: $labelID) {
    __typename
    ... on Label {
      id
    }
    ... on Error {
      __isError: __typename
      __typename
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "labelID"
        } as any
    ], v1 = [
        {
            "kind": "Variable",
            "name": "id",
            "variableName": "labelID"
        } as any
    ], v2 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
    } as any, v3 = {
        "kind": "InlineFragment",
        "selections": [
            {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
            }
        ],
        "type": "Label",
        "abstractKey": null
    } as any;
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "LabelsSelectEditDeleteMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "deleteLabel",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        (v3 /*: any*/)
                    ],
                    "storageKey": null
                }
            ],
            "type": "RootMutation",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "LabelsSelectEditDeleteMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "deleteLabel",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        (v3 /*: any*/),
                        {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isError"
                        }
                    ],
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "496a1e70556eb3c276c90a2b5ba48e60",
            "id": null,
            "metadata": {},
            "name": "LabelsSelectEditDeleteMutation",
            "operationKind": "mutation",
            "text": "mutation LabelsSelectEditDeleteMutation(\n  $labelID: ID!\n) {\n  deleteLabel(id: $labelID) {\n    __typename\n    ... on Label {\n      id\n    }\n    ... on Error {\n      __isError: __typename\n      __typename\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '0414746bb2dfc35b47267252c29f3159';
export default node;
