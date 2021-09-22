/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type BulkUnarchiveButtonUnrchivePartialMutationVariables = {
    ids: Array<string>;
};
export type BulkUnarchiveButtonUnrchivePartialMutationResponse = {
    readonly unarchiveLeadsBulk: ({
        readonly __typename: "BulkSuccessResult";
        readonly changedRecordsCount: number | null;
        readonly " $fragmentRefs": FragmentRefs<"bulkUnarchived_tracking_data">;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type BulkUnarchiveButtonUnrchivePartialMutation = {
    readonly response: BulkUnarchiveButtonUnrchivePartialMutationResponse;
    readonly variables: BulkUnarchiveButtonUnrchivePartialMutationVariables;
};



/*
mutation BulkUnarchiveButtonUnrchivePartialMutation(
  $ids: [ID!]!
) {
  unarchiveLeadsBulk(ids: $ids) {
    __typename
    ... on BulkSuccessResult {
      changedRecordsCount
      ...bulkUnarchived_tracking_data
    }
  }
}

fragment bulkUnarchived_tracking_data on BulkSuccessResult {
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
            "name": "BulkUnarchiveButtonUnrchivePartialMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "unarchiveLeadsBulk",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                (v3 /*: any*/),
                                {
                                    "kind": "InlineDataFragmentSpread",
                                    "name": "bulkUnarchived_tracking_data",
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
            "name": "BulkUnarchiveButtonUnrchivePartialMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "unarchiveLeadsBulk",
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
            "cacheID": "5b36b039c3020a19bc0ff1af1d086cef",
            "id": null,
            "metadata": {},
            "name": "BulkUnarchiveButtonUnrchivePartialMutation",
            "operationKind": "mutation",
            "text": "mutation BulkUnarchiveButtonUnrchivePartialMutation(\n  $ids: [ID!]!\n) {\n  unarchiveLeadsBulk(ids: $ids) {\n    __typename\n    ... on BulkSuccessResult {\n      changedRecordsCount\n      ...bulkUnarchived_tracking_data\n    }\n  }\n}\n\nfragment bulkUnarchived_tracking_data on BulkSuccessResult {\n  changedRecordsCount\n}\n"
        }
    } as any;
})();
(node as any).hash = 'e78cd5f22d2ffd641057afc4c89fe19b';
export default node;
