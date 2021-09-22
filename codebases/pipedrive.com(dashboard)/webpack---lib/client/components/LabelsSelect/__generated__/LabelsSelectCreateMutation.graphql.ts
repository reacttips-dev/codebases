/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type LabelColor = "BLUE" | "GRAY" | "GREEN" | "PURPLE" | "RED" | "YELLOW" | "%future added value";
export type CreateLabelInput = {
    colorName: LabelColor;
    name: string;
};
export type LabelsSelectCreateMutationVariables = {
    input: CreateLabelInput;
};
export type LabelsSelectCreateMutationResponse = {
    readonly createLabel: ({
        readonly __typename: "Label";
        readonly id: string;
        readonly legacyID: string;
        readonly name: string;
        readonly colorName: LabelColor | null;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type LabelsSelectCreateMutation = {
    readonly response: LabelsSelectCreateMutationResponse;
    readonly variables: LabelsSelectCreateMutationVariables;
};



/*
mutation LabelsSelectCreateMutation(
  $input: CreateLabelInput!
) {
  createLabel(input: $input) {
    __typename
    ... on Label {
      id
      legacyID: id(opaque: false)
      name
      colorName
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
            "name": "input"
        } as any
    ], v1 = [
        {
            "kind": "Variable",
            "name": "input",
            "variableName": "input"
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
            },
            {
                "alias": "legacyID",
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
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "LabelsSelectCreateMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "createLabel",
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
            "name": "LabelsSelectCreateMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "createLabel",
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
            "cacheID": "c9f63f6d388c783b882254a25a60cdaa",
            "id": null,
            "metadata": {},
            "name": "LabelsSelectCreateMutation",
            "operationKind": "mutation",
            "text": "mutation LabelsSelectCreateMutation(\n  $input: CreateLabelInput!\n) {\n  createLabel(input: $input) {\n    __typename\n    ... on Label {\n      id\n      legacyID: id(opaque: false)\n      name\n      colorName\n    }\n    ... on Error {\n      __isError: __typename\n      __typename\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '004ca93d5f1b0e9e69662c0d2b4b30e7';
export default node;
