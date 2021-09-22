/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type ListProvider_data = {
    readonly count: number | null;
    readonly activeCustomView: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"useSortColumns_customView">;
    } | null;
    readonly activeFilters: {
        readonly " $fragmentRefs": FragmentRefs<"FilterInitializer_activeFilters">;
    } | null;
    readonly " $refType": "ListProvider_data";
};
export type ListProvider_data$data = ListProvider_data;
export type ListProvider_data$key = {
    readonly " $data"?: ListProvider_data$data;
    readonly " $fragmentRefs": FragmentRefs<"ListProvider_data">;
};



const node: ReaderFragment = (function () {
    var v0 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any;
    return {
        "argumentDefinitions": [],
        "kind": "Fragment",
        "metadata": null,
        "name": "ListProvider_data",
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
                "concreteType": "CustomView",
                "kind": "LinkedField",
                "name": "activeCustomView",
                "plural": false,
                "selections": [
                    (v0 /*: any*/),
                    {
                        "kind": "InlineDataFragmentSpread",
                        "name": "useSortColumns_customView",
                        "selections": [
                            {
                                "alias": null,
                                "args": null,
                                "concreteType": "CustomViewField",
                                "kind": "LinkedField",
                                "name": "fields",
                                "plural": true,
                                "selections": [
                                    (v0 /*: any*/),
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
                            }
                        ]
                    }
                ],
                "storageKey": null
            },
            {
                "alias": null,
                "args": null,
                "concreteType": "LeadActiveFilters",
                "kind": "LinkedField",
                "name": "activeFilters",
                "plural": false,
                "selections": [
                    {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "FilterInitializer_activeFilters"
                    }
                ],
                "storageKey": null
            }
        ],
        "type": "LeadTableConnection",
        "abstractKey": null
    } as any;
})();
(node as any).hash = '925bf57ac5f2c0f5e644a6f2466d082d';
export default node;
