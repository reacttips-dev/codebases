/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type BulkDeleteButtonDeletePartialLeadsMutationVariables = {
    ids: Array<string>;
};
export type BulkDeleteButtonDeletePartialLeadsMutationResponse = {
    readonly deleteLeadsBulk: ({
        readonly __typename: "BulkSuccessResult";
        readonly changedRecordsCount: number | null;
        readonly " $fragmentRefs": FragmentRefs<"bulkDeleted_tracking_data">;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type BulkDeleteButtonDeletePartialLeadsMutation = {
    readonly response: BulkDeleteButtonDeletePartialLeadsMutationResponse;
    readonly variables: BulkDeleteButtonDeletePartialLeadsMutationVariables;
};



/*
mutation BulkDeleteButtonDeletePartialLeadsMutation(
  $ids: [ID!]!
) {
  deleteLeadsBulk(ids: $ids) {
    __typename
    ... on BulkSuccessResult {
      changedRecordsCount
      ...bulkDeleted_tracking_data
    }
  }
}

fragment bulkDeleted_tracking_data on BulkSuccessResult {
  changedRecordsCount
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "ids"
        } as any
    ], v1 = [
        {
            "kind": "Variable",
            "name": "ids",
            "variableName": "ids"
        } as any
    ], v2 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
    } as any, v3 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "changedRecordsCount",
        "storageKey": null
    } as any, v4 = [
        (v3 /*: any*/)
    ];
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "BulkDeleteButtonDeletePartialLeadsMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "deleteLeadsBulk",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                (v3 /*: any*/),
                                {
                                    "kind": "InlineDataFragmentSpread",
                                    "name": "bulkDeleted_tracking_data",
                                    "selections": (v4 /*: any*/)
                                }
                            ],
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
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "BulkDeleteButtonDeletePartialLeadsMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "deleteLeadsBulk",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": (v4 /*: any*/),
                            "type": "BulkSuccessResult",
                            "abstractKey": null
                        }
                    ],
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "3fa914387667f17de912a2cc4932482c",
            "id": null,
            "metadata": {},
            "name": "BulkDeleteButtonDeletePartialLeadsMutation",
            "operationKind": "mutation",
            "text": "mutation BulkDeleteButtonDeletePartialLeadsMutation(\n  $ids: [ID!]!\n) {\n  deleteLeadsBulk(ids: $ids) {\n    __typename\n    ... on BulkSuccessResult {\n      changedRecordsCount\n      ...bulkDeleted_tracking_data\n    }\n  }\n}\n\nfragment bulkDeleted_tracking_data on BulkSuccessResult {\n  changedRecordsCount\n}\n"
        }
    } as any;
})();
(node as any).hash = 'ad22173303e90289926ebb995acf132c';
export default node;
