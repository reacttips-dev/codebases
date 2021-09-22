/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type LeadDetailLoaderMarkAsSeenMutationVariables = {
    leadID: string;
};
export type LeadDetailLoaderMarkAsSeenMutationResponse = {
    readonly updateLead: ({
        readonly __typename: "Lead";
        readonly id: string;
        readonly wasSeen: boolean | null;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type LeadDetailLoaderMarkAsSeenMutationRawResponse = {
    readonly updateLead: ({
        readonly __typename: "Lead";
        readonly __isNode: "Lead";
        readonly id: string;
        readonly wasSeen: boolean | null;
    } | {
        readonly __typename: string;
        readonly __isNode: string;
        readonly id: string;
    }) | null;
};
export type LeadDetailLoaderMarkAsSeenMutation = {
    readonly response: LeadDetailLoaderMarkAsSeenMutationResponse;
    readonly variables: LeadDetailLoaderMarkAsSeenMutationVariables;
    readonly rawResponse: LeadDetailLoaderMarkAsSeenMutationRawResponse;
};



/*
mutation LeadDetailLoaderMarkAsSeenMutation(
  $leadID: ID!
) {
  updateLead(input: {id: $leadID, wasSeen: true}) {
    __typename
    ... on Lead {
      id
      wasSeen
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "leadID"
        } as any
    ], v1 = [
        {
            "fields": [
                {
                    "kind": "Variable",
                    "name": "id",
                    "variableName": "leadID"
                },
                {
                    "kind": "Literal",
                    "name": "wasSeen",
                    "value": true
                }
            ],
            "kind": "ObjectValue",
            "name": "input"
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
        "name": "id",
        "storageKey": null
    } as any, v4 = {
        "kind": "InlineFragment",
        "selections": [
            (v3 /*: any*/),
            {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "wasSeen",
                "storageKey": null
            }
        ],
        "type": "Lead",
        "abstractKey": null
    } as any;
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "LeadDetailLoaderMarkAsSeenMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateLead",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        (v4 /*: any*/)
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
            "name": "LeadDetailLoaderMarkAsSeenMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateLead",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        (v4 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                (v3 /*: any*/)
                            ],
                            "type": "Node",
                            "abstractKey": "__isNode"
                        }
                    ],
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "a25c496b6689f36b9c8305f1566f8e82",
            "id": null,
            "metadata": {},
            "name": "LeadDetailLoaderMarkAsSeenMutation",
            "operationKind": "mutation",
            "text": "mutation LeadDetailLoaderMarkAsSeenMutation(\n  $leadID: ID!\n) {\n  updateLead(input: {id: $leadID, wasSeen: true}) {\n    __typename\n    ... on Lead {\n      id\n      wasSeen\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = 'd442e497fb9e5808122e9c41e7f82d35';
export default node;
