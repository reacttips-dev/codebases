/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type ListViewContentCustomViewRefetchQueryVariables = {
    id: string;
};
export type ListViewContentCustomViewRefetchQueryResponse = {
    readonly node: {
        readonly id?: string;
        readonly fields?: ReadonlyArray<{
            readonly __typename: string;
        }> | null;
        readonly " $fragmentRefs": FragmentRefs<"ListViewContent_customView">;
    } | null;
};
export type ListViewContentCustomViewRefetchQuery = {
    readonly response: ListViewContentCustomViewRefetchQueryResponse;
    readonly variables: ListViewContentCustomViewRefetchQueryVariables;
};



/*
query ListViewContentCustomViewRefetchQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    ... on CustomView {
      id
      fields {
        __typename
        id
      }
      ...ListViewContent_customView
    }
    id
  }
}

fragment LeadCustomViewModal_customView on CustomView {
  customViewId: id(opaque: false)
  fields {
    fieldDefinition {
      entityType
      key
    }
    width
    sortDirection
    sortSequence
    id
  }
  filter {
    id
  }
}

fragment ListViewContent_customView on CustomView {
  id
  internalID: id(opaque: false)
  fields {
    id
    width
    fieldDefinition {
      name
      entityType
      key
    }
  }
  ...LeadCustomViewModal_customView
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "id"
        } as any
    ], v1 = [
        {
            "kind": "Variable",
            "name": "id",
            "variableName": "id"
        } as any
    ], v2 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v3 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
    } as any, v4 = [
        {
            "kind": "Literal",
            "name": "opaque",
            "value": false
        } as any
    ];
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "ListViewContentCustomViewRefetchQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                (v2 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "CustomViewField",
                                    "kind": "LinkedField",
                                    "name": "fields",
                                    "plural": true,
                                    "selections": [
                                        (v3 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                {
                                    "args": null,
                                    "kind": "FragmentSpread",
                                    "name": "ListViewContent_customView"
                                }
                            ],
                            "type": "CustomView",
                            "abstractKey": null
                        }
                    ],
                    "storageKey": null
                }
            ],
            "type": "RootQuery",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "ListViewContentCustomViewRefetchQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                        (v3 /*: any*/),
                        (v2 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "CustomViewField",
                                    "kind": "LinkedField",
                                    "name": "fields",
                                    "plural": true,
                                    "selections": [
                                        (v3 /*: any*/),
                                        (v2 /*: any*/),
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "width",
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "FieldDefinition",
                                            "kind": "LinkedField",
                                            "name": "fieldDefinition",
                                            "plural": false,
                                            "selections": [
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
                                                    "name": "entityType",
                                                    "storageKey": null
                                                },
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "key",
                                                    "storageKey": null
                                                }
                                            ],
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "sortDirection",
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "sortSequence",
                                            "storageKey": null
                                        }
                                    ],
                                    "storageKey": null
                                },
                                {
                                    "alias": "internalID",
                                    "args": (v4 /*: any*/),
                                    "kind": "ScalarField",
                                    "name": "id",
                                    "storageKey": "id(opaque:false)"
                                },
                                {
                                    "alias": "customViewId",
                                    "args": (v4 /*: any*/),
                                    "kind": "ScalarField",
                                    "name": "id",
                                    "storageKey": "id(opaque:false)"
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Filter",
                                    "kind": "LinkedField",
                                    "name": "filter",
                                    "plural": false,
                                    "selections": [
                                        (v2 /*: any*/)
                                    ],
                                    "storageKey": null
                                }
                            ],
                            "type": "CustomView",
                            "abstractKey": null
                        }
                    ],
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "e465b10e16e98324d9fec56a3e076adf",
            "id": null,
            "metadata": {},
            "name": "ListViewContentCustomViewRefetchQuery",
            "operationKind": "query",
            "text": "query ListViewContentCustomViewRefetchQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on CustomView {\n      id\n      fields {\n        __typename\n        id\n      }\n      ...ListViewContent_customView\n    }\n    id\n  }\n}\n\nfragment LeadCustomViewModal_customView on CustomView {\n  customViewId: id(opaque: false)\n  fields {\n    fieldDefinition {\n      entityType\n      key\n    }\n    width\n    sortDirection\n    sortSequence\n    id\n  }\n  filter {\n    id\n  }\n}\n\nfragment ListViewContent_customView on CustomView {\n  id\n  internalID: id(opaque: false)\n  fields {\n    id\n    width\n    fieldDefinition {\n      name\n      entityType\n      key\n    }\n  }\n  ...LeadCustomViewModal_customView\n}\n"
        }
    } as any;
})();
(node as any).hash = 'ce70371816dd67ab357c6aa141c93c9b';
export default node;
