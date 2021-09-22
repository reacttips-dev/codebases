/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FilterInitializer_activeFilters = {
    readonly sources: ReadonlyArray<{
        readonly id: string;
    }> | null;
    readonly labels: ReadonlyArray<{
        readonly id: string;
    }> | null;
    readonly filter: {
        readonly id: string;
    } | null;
    readonly owner: {
        readonly id: string;
    } | null;
    readonly user: {
        readonly id: string;
    } | null;
    readonly team: {
        readonly id: string;
    } | null;
    readonly " $refType": "FilterInitializer_activeFilters";
};
export type FilterInitializer_activeFilters$data = FilterInitializer_activeFilters;
export type FilterInitializer_activeFilters$key = {
    readonly " $data"?: FilterInitializer_activeFilters$data;
    readonly " $fragmentRefs": FragmentRefs<"FilterInitializer_activeFilters">;
};



const node: ReaderFragment = (function () {
    var v0 = [
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
        } as any
    ];
    return {
        "argumentDefinitions": [],
        "kind": "Fragment",
        "metadata": null,
        "name": "FilterInitializer_activeFilters",
        "selections": [
            {
                "alias": null,
                "args": null,
                "concreteType": "LeadSource",
                "kind": "LinkedField",
                "name": "sources",
                "plural": true,
                "selections": (v0 /*: any*/),
                "storageKey": null
            },
            {
                "alias": null,
                "args": null,
                "concreteType": "Label",
                "kind": "LinkedField",
                "name": "labels",
                "plural": true,
                "selections": (v0 /*: any*/),
                "storageKey": null
            },
            {
                "alias": null,
                "args": null,
                "concreteType": "Filter",
                "kind": "LinkedField",
                "name": "filter",
                "plural": false,
                "selections": (v0 /*: any*/),
                "storageKey": null
            },
            {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "owner",
                "plural": false,
                "selections": (v0 /*: any*/),
                "storageKey": null
            },
            {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": (v0 /*: any*/),
                "storageKey": null
            },
            {
                "alias": null,
                "args": null,
                "concreteType": "Team",
                "kind": "LinkedField",
                "name": "team",
                "plural": false,
                "selections": (v0 /*: any*/),
                "storageKey": null
            }
        ],
        "type": "LeadActiveFilters",
        "abstractKey": null
    } as any;
})();
(node as any).hash = '2400735fe5b1107c75ade27187c4dd64';
export default node;
