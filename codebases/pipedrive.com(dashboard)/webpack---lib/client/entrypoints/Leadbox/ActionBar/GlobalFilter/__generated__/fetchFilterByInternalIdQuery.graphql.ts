/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type VisibleTo = "GLOBAL" | "PRIVATE" | "SHARED" | "SHARED_BELOW" | "%future added value";
export type fetchFilterByInternalIdQueryVariables = {
    internalId: number;
};
export type fetchFilterByInternalIdQueryResponse = {
    readonly filter: {
        readonly id: string;
        readonly legacyID: string;
        readonly name: string;
        readonly visibleTo: VisibleTo | null;
        readonly user: {
            readonly id: string;
            readonly legacyID: string;
        } | null;
    } | null;
};
export type fetchFilterByInternalIdQuery = {
    readonly response: fetchFilterByInternalIdQueryResponse;
    readonly variables: fetchFilterByInternalIdQueryVariables;
};



/*
query fetchFilterByInternalIdQuery(
  $internalId: Int!
) {
  filter(internalId: $internalId) {
    id
    legacyID: id(opaque: false)
    name
    visibleTo
    user {
      id
      legacyID: id(opaque: false)
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "internalId"
        } as any
    ], v1 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v2 = {
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
    } as any, v3 = [
        {
            "alias": null,
            "args": [
                {
                    "kind": "Variable",
                    "name": "internalId",
                    "variableName": "internalId"
                }
            ],
            "concreteType": "Filter",
            "kind": "LinkedField",
            "name": "filter",
            "plural": false,
            "selections": [
                (v1 /*: any*/),
                (v2 /*: any*/),
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
                    "name": "visibleTo",
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "user",
                    "plural": false,
                    "selections": [
                        (v1 /*: any*/),
                        (v2 /*: any*/)
                    ],
                    "storageKey": null
                }
            ],
            "storageKey": null
        } as any
    ];
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "fetchFilterByInternalIdQuery",
            "selections": (v3 /*: any*/),
            "type": "RootQuery",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "fetchFilterByInternalIdQuery",
            "selections": (v3 /*: any*/)
        },
        "params": {
            "cacheID": "0146cdac991d1fff9e1b9f51e255ed29",
            "id": null,
            "metadata": {},
            "name": "fetchFilterByInternalIdQuery",
            "operationKind": "query",
            "text": "query fetchFilterByInternalIdQuery(\n  $internalId: Int!\n) {\n  filter(internalId: $internalId) {\n    id\n    legacyID: id(opaque: false)\n    name\n    visibleTo\n    user {\n      id\n      legacyID: id(opaque: false)\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '13431c95f5a1f767598fc7ba0951b822';
export default node;
