/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type ListView_data = {
    readonly leadView: {
        readonly activeCustomView: {
            readonly fields: ReadonlyArray<{
                readonly __typename: string;
            }> | null;
            readonly " $fragmentRefs": FragmentRefs<"ListViewContent_customView">;
        } | null;
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"ListViewContent_rows">;
            } | null;
        } | null> | null;
        readonly " $fragmentRefs": FragmentRefs<"LeadDetailLoader_data">;
    } | null;
    readonly " $refType": "ListView_data";
};
export type ListView_data$data = ListView_data;
export type ListView_data$key = {
    readonly " $data"?: ListView_data$data;
    readonly " $fragmentRefs": FragmentRefs<"ListView_data">;
};



const node: ReaderFragment = (function () {
    var v0 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
    } as any;
    return {
        "argumentDefinitions": [
            {
                "defaultValue": null,
                "kind": "LocalArgument",
                "name": "after"
            },
            {
                "defaultValue": null,
                "kind": "LocalArgument",
                "name": "filter"
            },
            {
                "defaultValue": null,
                "kind": "LocalArgument",
                "name": "first"
            },
            {
                "defaultValue": null,
                "kind": "LocalArgument",
                "name": "sort"
            },
            {
                "defaultValue": null,
                "kind": "LocalArgument",
                "name": "status"
            }
        ],
        "kind": "Fragment",
        "metadata": {
            "connection": [
                {
                    "count": "first",
                    "cursor": "after",
                    "direction": "forward",
                    "path": [
                        "leadView"
                    ]
                }
            ]
        },
        "name": "ListView_data",
        "selections": [
            {
                "alias": "leadView",
                "args": [
                    {
                        "kind": "Variable",
                        "name": "filter",
                        "variableName": "filter"
                    },
                    {
                        "kind": "Variable",
                        "name": "sort",
                        "variableName": "sort"
                    },
                    {
                        "kind": "Variable",
                        "name": "status",
                        "variableName": "status"
                    }
                ],
                "concreteType": "LeadTableConnection",
                "kind": "LinkedField",
                "name": "__ListView_leadView_connection",
                "plural": false,
                "selections": [
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "CustomView",
                        "kind": "LinkedField",
                        "name": "activeCustomView",
                        "plural": false,
                        "selections": [
                            {
                                "alias": null,
                                "args": null,
                                "concreteType": "CustomViewField",
                                "kind": "LinkedField",
                                "name": "fields",
                                "plural": true,
                                "selections": [
                                    (v0 /*: any*/)
                                ],
                                "storageKey": null
                            },
                            {
                                "args": null,
                                "kind": "FragmentSpread",
                                "name": "ListViewContent_customView"
                            }
                        ],
                        "storageKey": null
                    },
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "LeadTableEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                            {
                                "alias": null,
                                "args": null,
                                "concreteType": "LeadTableRow",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                    (v0 /*: any*/),
                                    {
                                        "args": null,
                                        "kind": "FragmentSpread",
                                        "name": "ListViewContent_rows"
                                    }
                                ],
                                "storageKey": null
                            },
                            {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "cursor",
                                "storageKey": null
                            }
                        ],
                        "storageKey": null
                    },
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "PageInfo",
                        "kind": "LinkedField",
                        "name": "pageInfo",
                        "plural": false,
                        "selections": [
                            {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "endCursor",
                                "storageKey": null
                            },
                            {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "hasNextPage",
                                "storageKey": null
                            }
                        ],
                        "storageKey": null
                    },
                    {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "LeadDetailLoader_data"
                    }
                ],
                "storageKey": null
            }
        ],
        "type": "RootQuery",
        "abstractKey": null
    } as any;
})();
(node as any).hash = 'fab6447d1507b68955e6bcda8ba06737';
export default node;
