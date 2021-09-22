/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type VisibleTo = "GLOBAL" | "PRIVATE" | "SHARED" | "SHARED_BELOW" | "%future added value";
export type LeadsBulkUpdateDataInput = {
    labels?: Array<string> | null;
    ownerLegacyId?: number | null;
    title?: string | null;
    value?: MoneyInput | null;
    visibleTo?: VisibleTo | null;
};
export type MoneyInput = {
    amount: string;
    currency: string;
};
export type BulkEditPanelInnerUpdateLeadsBulkMutationVariables = {
    ids: Array<string>;
    data: LeadsBulkUpdateDataInput;
};
export type BulkEditPanelInnerUpdateLeadsBulkMutationResponse = {
    readonly updateLeadsBulk: ({
        readonly __typename: "BulkSuccessResult";
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type BulkEditPanelInnerUpdateLeadsBulkMutation = {
    readonly response: BulkEditPanelInnerUpdateLeadsBulkMutationResponse;
    readonly variables: BulkEditPanelInnerUpdateLeadsBulkMutationVariables;
};



/*
mutation BulkEditPanelInnerUpdateLeadsBulkMutation(
  $ids: [ID!]!
  $data: LeadsBulkUpdateDataInput!
) {
  updateLeadsBulk(ids: $ids, data: $data) {
    __typename
    ... on BulkSuccessResult {
      __typename
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "data"
    } as any, v1 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "ids"
    } as any, v2 = [
        {
            "kind": "Variable",
            "name": "data",
            "variableName": "data"
        } as any,
        {
            "kind": "Variable",
            "name": "ids",
            "variableName": "ids"
        } as any
    ], v3 = [
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
        } as any
    ];
    return {
        "fragment": {
            "argumentDefinitions": [
                (v0 /*: any*/),
                (v1 /*: any*/)
            ],
            "kind": "Fragment",
            "metadata": null,
            "name": "BulkEditPanelInnerUpdateLeadsBulkMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v2 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateLeadsBulk",
                    "plural": false,
                    "selections": [
                        {
                            "kind": "InlineFragment",
                            "selections": (v3 /*: any*/),
                            "type": "BulkSuccessResult",
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
            "argumentDefinitions": [
                (v1 /*: any*/),
                (v0 /*: any*/)
            ],
            "kind": "Operation",
            "name": "BulkEditPanelInnerUpdateLeadsBulkMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v2 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateLeadsBulk",
                    "plural": false,
                    "selections": (v3 /*: any*/),
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "26855575f4244f37bf8ba36a311eb94b",
            "id": null,
            "metadata": {},
            "name": "BulkEditPanelInnerUpdateLeadsBulkMutation",
            "operationKind": "mutation",
            "text": "mutation BulkEditPanelInnerUpdateLeadsBulkMutation(\n  $ids: [ID!]!\n  $data: LeadsBulkUpdateDataInput!\n) {\n  updateLeadsBulk(ids: $ids, data: $data) {\n    __typename\n    ... on BulkSuccessResult {\n      __typename\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '60d4ec9026237a76069586ec6f7a6c6a';
export default node;
