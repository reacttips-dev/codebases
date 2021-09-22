/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type updateLeadAfterConvertMutationVariables = {
    leadId: string;
    dealId: number;
    personId?: number | null;
    organizationId?: number | null;
    customViewId?: string | null;
};
export type updateLeadAfterConvertMutationResponse = {
    readonly markLeadAsConvertedForView: ({
        readonly __typename: "LeadTableRow";
        readonly id: string;
        readonly lead: {
            readonly id: string;
            readonly isArchived: boolean | null;
        } | null;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type updateLeadAfterConvertMutation = {
    readonly response: updateLeadAfterConvertMutationResponse;
    readonly variables: updateLeadAfterConvertMutationVariables;
};



/*
mutation updateLeadAfterConvertMutation(
  $leadId: ID!
  $dealId: Int!
  $personId: Int
  $organizationId: Int
  $customViewId: ID
) {
  markLeadAsConvertedForView(input: {leadId: $leadId, dealId: $dealId, personId: $personId, organizationId: $organizationId}, customViewId: $customViewId) {
    __typename
    ... on LeadTableRow {
      id
      lead {
        id
        isArchived
      }
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "customViewId"
    } as any, v1 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "dealId"
    } as any, v2 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "leadId"
    } as any, v3 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "organizationId"
    } as any, v4 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "personId"
    } as any, v5 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v6 = [
        {
            "alias": null,
            "args": [
                {
                    "kind": "Variable",
                    "name": "customViewId",
                    "variableName": "customViewId"
                },
                {
                    "fields": [
                        {
                            "kind": "Variable",
                            "name": "dealId",
                            "variableName": "dealId"
                        },
                        {
                            "kind": "Variable",
                            "name": "leadId",
                            "variableName": "leadId"
                        },
                        {
                            "kind": "Variable",
                            "name": "organizationId",
                            "variableName": "organizationId"
                        },
                        {
                            "kind": "Variable",
                            "name": "personId",
                            "variableName": "personId"
                        }
                    ],
                    "kind": "ObjectValue",
                    "name": "input"
                }
            ],
            "concreteType": null,
            "kind": "LinkedField",
            "name": "markLeadAsConvertedForView",
            "plural": false,
            "selections": [
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                },
                {
                    "kind": "InlineFragment",
                    "selections": [
                        (v5 /*: any*/),
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "Lead",
                            "kind": "LinkedField",
                            "name": "lead",
                            "plural": false,
                            "selections": [
                                (v5 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isArchived",
                                    "storageKey": null
                                }
                            ],
                            "storageKey": null
                        }
                    ],
                    "type": "LeadTableRow",
                    "abstractKey": null
                }
            ],
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
                (v4 /*: any*/)
            ],
            "kind": "Fragment",
            "metadata": null,
            "name": "updateLeadAfterConvertMutation",
            "selections": (v6 /*: any*/),
            "type": "RootMutation",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": [
                (v2 /*: any*/),
                (v1 /*: any*/),
                (v4 /*: any*/),
                (v3 /*: any*/),
                (v0 /*: any*/)
            ],
            "kind": "Operation",
            "name": "updateLeadAfterConvertMutation",
            "selections": (v6 /*: any*/)
        },
        "params": {
            "cacheID": "30672d8b3d76a6bcda8ac4fc616bbcd1",
            "id": null,
            "metadata": {},
            "name": "updateLeadAfterConvertMutation",
            "operationKind": "mutation",
            "text": "mutation updateLeadAfterConvertMutation(\n  $leadId: ID!\n  $dealId: Int!\n  $personId: Int\n  $organizationId: Int\n  $customViewId: ID\n) {\n  markLeadAsConvertedForView(input: {leadId: $leadId, dealId: $dealId, personId: $personId, organizationId: $organizationId}, customViewId: $customViewId) {\n    __typename\n    ... on LeadTableRow {\n      id\n      lead {\n        id\n        isArchived\n      }\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '11c402270046454b41020ca2971d636d';
export default node;
