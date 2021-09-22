/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelColor = "BLUE" | "GRAY" | "GREEN" | "PURPLE" | "RED" | "YELLOW" | "%future added value";
export type UpdateLabelInput = {
    colorName?: LabelColor | null;
    id: string;
    name?: string | null;
};
export type LabelsSelectEditMutationVariables = {
    input: UpdateLabelInput;
};
export type LabelsSelectEditMutationResponse = {
    readonly updateLabel: ({
        readonly __typename: "Label";
        readonly " $fragmentRefs": FragmentRefs<"LabelsSelectEdit_label">;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type LabelsSelectEditMutation = {
    readonly response: LabelsSelectEditMutationResponse;
    readonly variables: LabelsSelectEditMutationVariables;
};



/*
mutation LabelsSelectEditMutation(
  $input: UpdateLabelInput!
) {
  updateLabel(input: $input) {
    __typename
    ... on Label {
      ...LabelsSelectEdit_label
      id
    }
    ... on Error {
      __isError: __typename
      __typename
    }
  }
}

fragment LabelsSelectDeleteConfirm_label on Label {
  legacyLabelID: id(opaque: false)
}

fragment LabelsSelectEdit_label on Label {
  id
  name
  colorName
  ...LabelsSelectDeleteConfirm_label
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
    } as any;
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "LabelsSelectEditMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateLabel",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                {
                                    "args": null,
                                    "kind": "FragmentSpread",
                                    "name": "LabelsSelectEdit_label"
                                }
                            ],
                            "type": "Label",
                            "abstractKey": null
                        }
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
            "name": "LabelsSelectEditMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateLabel",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        {
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
                                },
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
                        },
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
            "cacheID": "6c5543453a0d77fdd4dd16b5033e97c8",
            "id": null,
            "metadata": {},
            "name": "LabelsSelectEditMutation",
            "operationKind": "mutation",
            "text": "mutation LabelsSelectEditMutation(\n  $input: UpdateLabelInput!\n) {\n  updateLabel(input: $input) {\n    __typename\n    ... on Label {\n      ...LabelsSelectEdit_label\n      id\n    }\n    ... on Error {\n      __isError: __typename\n      __typename\n    }\n  }\n}\n\nfragment LabelsSelectDeleteConfirm_label on Label {\n  legacyLabelID: id(opaque: false)\n}\n\nfragment LabelsSelectEdit_label on Label {\n  id\n  name\n  colorName\n  ...LabelsSelectDeleteConfirm_label\n}\n"
        }
    } as any;
})();
(node as any).hash = '05b02f4eb9299192a8a5c85d93cc738d';
export default node;
