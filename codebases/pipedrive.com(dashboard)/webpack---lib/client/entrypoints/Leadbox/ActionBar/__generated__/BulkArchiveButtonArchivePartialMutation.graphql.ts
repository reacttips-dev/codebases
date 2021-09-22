/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type BulkArchiveButtonArchivePartialMutationVariables = {
    ids: Array<string>;
};
export type BulkArchiveButtonArchivePartialMutationResponse = {
    readonly archiveLeadsBulk: ({
        readonly __typename: "BulkSuccessResult";
        readonly changedRecordsCount: number | null;
        readonly " $fragmentRefs": FragmentRefs<"bulkArchived_tracking_data">;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type BulkArchiveButtonArchivePartialMutation = {
    readonly response: BulkArchiveButtonArchivePartialMutationResponse;
    readonly variables: BulkArchiveButtonArchivePartialMutationVariables;
};



/*
mutation BulkArchiveButtonArchivePartialMutation(
  $ids: [ID!]!
) {
  archiveLeadsBulk(ids: $ids) {
    __typename
    ... on BulkSuccessResult {
      changedRecordsCount
      ...bulkArchived_tracking_data
    }
  }
}

fragment bulkArchived_tracking_data on BulkSuccessResult {
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
            "name": "BulkArchiveButtonArchivePartialMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "archiveLeadsBulk",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                (v3 /*: any*/),
                                {
                                    "kind": "InlineDataFragmentSpread",
                                    "name": "bulkArchived_tracking_data",
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
            "name": "BulkArchiveButtonArchivePartialMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "archiveLeadsBulk",
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
            "cacheID": "bf9a181df1c5257f7c2fb2a3643868f4",
            "id": null,
            "metadata": {},
            "name": "BulkArchiveButtonArchivePartialMutation",
            "operationKind": "mutation",
            "text": "mutation BulkArchiveButtonArchivePartialMutation(\n  $ids: [ID!]!\n) {\n  archiveLeadsBulk(ids: $ids) {\n    __typename\n    ... on BulkSuccessResult {\n      changedRecordsCount\n      ...bulkArchived_tracking_data\n    }\n  }\n}\n\nfragment bulkArchived_tracking_data on BulkSuccessResult {\n  changedRecordsCount\n}\n"
        }
    } as any;
})();
(node as any).hash = 'ed9fb68b8a431fa06171bdd295d5d70b';
export default node;
