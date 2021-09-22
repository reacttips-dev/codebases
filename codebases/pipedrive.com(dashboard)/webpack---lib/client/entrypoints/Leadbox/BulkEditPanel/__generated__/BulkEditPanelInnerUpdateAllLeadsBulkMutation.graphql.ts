/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type LeadStatus = "ALL" | "ARCHIVED" | "%future added value";
export type LeadsLegacySortColumn = "ACTIVITIES" | "CREATED_AT" | "LABELS" | "OWNER" | "SOURCE" | "TITLE" | "%future added value";
export type LeadsLegacySortDirection = "ASC" | "DESC" | "%future added value";
export type SortDirection = "ASC" | "DESC" | "%future added value";
export type VisibleTo = "GLOBAL" | "PRIVATE" | "SHARED" | "SHARED_BELOW" | "%future added value";
export type LeadsFilter = {
    filter?: string | null;
    labels?: Array<string> | null;
    owner?: string | null;
    sources?: Array<string> | null;
    useStoredFilters?: boolean | null;
};
export type LeadsLegacySort = {
    column: LeadsLegacySortColumn;
    direction: LeadsLegacySortDirection;
};
export type LeadsSort = {
    direction: SortDirection;
    id: string;
};
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
export type BulkEditPanelInnerUpdateAllLeadsBulkMutationVariables = {
    excludeIds: Array<string>;
    filter: LeadsFilter;
    status: LeadStatus;
    legacySort?: LeadsLegacySort | null;
    sort?: Array<LeadsSort> | null;
    data: LeadsBulkUpdateDataInput;
};
export type BulkEditPanelInnerUpdateAllLeadsBulkMutationResponse = {
    readonly updateAllLeadsBulk: ({
        readonly __typename: "BulkSuccessResult";
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type BulkEditPanelInnerUpdateAllLeadsBulkMutation = {
    readonly response: BulkEditPanelInnerUpdateAllLeadsBulkMutationResponse;
    readonly variables: BulkEditPanelInnerUpdateAllLeadsBulkMutationVariables;
};



/*
mutation BulkEditPanelInnerUpdateAllLeadsBulkMutation(
  $excludeIds: [ID!]!
  $filter: LeadsFilter!
  $status: LeadStatus!
  $legacySort: LeadsLegacySort
  $sort: [LeadsSort!]
  $data: LeadsBulkUpdateDataInput!
) {
  updateAllLeadsBulk(excludeIds: $excludeIds, filter: $filter, status: $status, legacySort: $legacySort, sort: $sort, data: $data) {
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
        "name": "excludeIds"
    } as any, v2 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "filter"
    } as any, v3 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "legacySort"
    } as any, v4 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "sort"
    } as any, v5 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "status"
    } as any, v6 = [
        {
            "kind": "Variable",
            "name": "data",
            "variableName": "data"
        } as any,
        {
            "kind": "Variable",
            "name": "excludeIds",
            "variableName": "excludeIds"
        } as any,
        {
            "kind": "Variable",
            "name": "filter",
            "variableName": "filter"
        } as any,
        {
            "kind": "Variable",
            "name": "legacySort",
            "variableName": "legacySort"
        } as any,
        {
            "kind": "Variable",
            "name": "sort",
            "variableName": "sort"
        } as any,
        {
            "kind": "Variable",
            "name": "status",
            "variableName": "status"
        } as any
    ], v7 = [
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
                (v1 /*: any*/),
                (v2 /*: any*/),
                (v3 /*: any*/),
                (v4 /*: any*/),
                (v5 /*: any*/)
            ],
            "kind": "Fragment",
            "metadata": null,
            "name": "BulkEditPanelInnerUpdateAllLeadsBulkMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v6 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateAllLeadsBulk",
                    "plural": false,
                    "selections": [
                        {
                            "kind": "InlineFragment",
                            "selections": (v7 /*: any*/),
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
                (v2 /*: any*/),
                (v5 /*: any*/),
                (v3 /*: any*/),
                (v4 /*: any*/),
                (v0 /*: any*/)
            ],
            "kind": "Operation",
            "name": "BulkEditPanelInnerUpdateAllLeadsBulkMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v6 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateAllLeadsBulk",
                    "plural": false,
                    "selections": (v7 /*: any*/),
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "18c90bef2d60059568ff04cdbf5fde16",
            "id": null,
            "metadata": {},
            "name": "BulkEditPanelInnerUpdateAllLeadsBulkMutation",
            "operationKind": "mutation",
            "text": "mutation BulkEditPanelInnerUpdateAllLeadsBulkMutation(\n  $excludeIds: [ID!]!\n  $filter: LeadsFilter!\n  $status: LeadStatus!\n  $legacySort: LeadsLegacySort\n  $sort: [LeadsSort!]\n  $data: LeadsBulkUpdateDataInput!\n) {\n  updateAllLeadsBulk(excludeIds: $excludeIds, filter: $filter, status: $status, legacySort: $legacySort, sort: $sort, data: $data) {\n    __typename\n    ... on BulkSuccessResult {\n      __typename\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '80f0e727802fbab7544a1fda99818c0e';
export default node;
