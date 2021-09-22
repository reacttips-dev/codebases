/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type Layout_data = {
    readonly inboxCount: number | null;
    readonly archivedCount: number | null;
    readonly leadView: {
        readonly count: number | null;
        readonly edges: ReadonlyArray<{
            readonly __typename: string;
        } | null> | null;
        readonly " $fragmentRefs": FragmentRefs<"LayoutHeader_leadView" | "ListProvider_data">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"LayoutHeader_data" | "ListView_data">;
    readonly " $refType": "Layout_data";
};
export type Layout_data$data = Layout_data;
export type Layout_data$key = {
    readonly " $data"?: Layout_data$data;
    readonly " $fragmentRefs": FragmentRefs<"Layout_data">;
};



const node: ReaderFragment = (function () {
    var v0 = {
        "kind": "Variable",
        "name": "filter",
        "variableName": "filter"
    } as any, v1 = {
        "kind": "Variable",
        "name": "sort",
        "variableName": "sort"
    } as any, v2 = {
        "kind": "Variable",
        "name": "status",
        "variableName": "status"
    } as any, v3 = {
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
            },
            {
                "defaultValue": null,
                "kind": "LocalArgument",
                "name": "teamsFeature"
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
        "name": "Layout_data",
        "selections": [
            {
                "alias": "inboxCount",
                "args": [
                    {
                        "kind": "Literal",
                        "name": "page",
                        "value": "INBOX"
                    }
                ],
                "kind": "ScalarField",
                "name": "leadsCount",
                "storageKey": "leadsCount(page:\"INBOX\")"
            },
            {
                "alias": "archivedCount",
                "args": [
                    {
                        "kind": "Literal",
                        "name": "page",
                        "value": "ARCHIVE"
                    }
                ],
                "kind": "ScalarField",
                "name": "leadsCount",
                "storageKey": "leadsCount(page:\"ARCHIVE\")"
            },
            {
                "alias": "leadView",
                "args": [
                    (v0 /*: any*/),
                    (v1 /*: any*/),
                    (v2 /*: any*/)
                ],
                "concreteType": "LeadTableConnection",
                "kind": "LinkedField",
                "name": "__ListView_leadView_connection",
                "plural": false,
                "selections": [
                    {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
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
                            (v3 /*: any*/),
                            {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "cursor",
                                "storageKey": null
                            },
                            {
                                "alias": null,
                                "args": null,
                                "concreteType": "LeadTableRow",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                    (v3 /*: any*/)
                                ],
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
                        "name": "LayoutHeader_leadView"
                    },
                    {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "ListProvider_data"
                    }
                ],
                "storageKey": null
            },
            {
                "args": [
                    {
                        "kind": "Variable",
                        "name": "teamsFeature",
                        "variableName": "teamsFeature"
                    }
                ],
                "kind": "FragmentSpread",
                "name": "LayoutHeader_data"
            },
            {
                "args": [
                    (v0 /*: any*/),
                    {
                        "kind": "Variable",
                        "name": "first",
                        "variableName": "first"
                    },
                    (v1 /*: any*/),
                    (v2 /*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "ListView_data"
            }
        ],
        "type": "RootQuery",
        "abstractKey": null
    } as any;
})();
(node as any).hash = 'da6e2811cc5d23fa8238ee0106f526d4';
export default node;
