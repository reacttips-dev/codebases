/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type VisibleTo = "GLOBAL" | "PRIVATE" | "SHARED" | "SHARED_BELOW" | "%future added value";
export type GlobalFilter_data = {
    readonly users: ReadonlyArray<{
        readonly id: string;
        readonly legacyID: string;
        readonly name: string | null;
    } | null> | null;
    readonly teams?: ReadonlyArray<{
        readonly id: string;
        readonly legacyID: string;
        readonly name: string | null;
    } | null> | null;
    readonly filters: ReadonlyArray<{
        readonly id: string;
        readonly legacyID: string;
        readonly name: string;
        readonly visibleTo: VisibleTo | null;
        readonly user: {
            readonly id: string;
            readonly legacyID: string;
        } | null;
        readonly customView: {
            readonly legacyID: string;
        } | null;
    } | null> | null;
    readonly " $refType": "GlobalFilter_data";
};
export type GlobalFilter_data$data = GlobalFilter_data;
export type GlobalFilter_data$key = {
    readonly " $data"?: GlobalFilter_data$data;
    readonly " $fragmentRefs": FragmentRefs<"GlobalFilter_data">;
};



const node: ReaderFragment = (function () {
    var v0 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v1 = {
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
    } as any, v2 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
    } as any, v3 = [
        (v0 /*: any*/),
        (v1 /*: any*/),
        (v2 /*: any*/)
    ];
    return {
        "argumentDefinitions": [
            {
                "defaultValue": null,
                "kind": "LocalArgument",
                "name": "teamsFeature"
            }
        ],
        "kind": "Fragment",
        "metadata": null,
        "name": "GlobalFilter_data",
        "selections": [
            {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "users",
                "plural": true,
                "selections": (v3 /*: any*/),
                "storageKey": null
            },
            {
                "alias": null,
                "args": null,
                "concreteType": "Filter",
                "kind": "LinkedField",
                "name": "filters",
                "plural": true,
                "selections": [
                    (v0 /*: any*/),
                    (v1 /*: any*/),
                    (v2 /*: any*/),
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
                            (v0 /*: any*/),
                            (v1 /*: any*/)
                        ],
                        "storageKey": null
                    },
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "CustomView",
                        "kind": "LinkedField",
                        "name": "customView",
                        "plural": false,
                        "selections": [
                            (v1 /*: any*/)
                        ],
                        "storageKey": null
                    }
                ],
                "storageKey": null
            },
            {
                "condition": "teamsFeature",
                "kind": "Condition",
                "passingValue": true,
                "selections": [
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "Team",
                        "kind": "LinkedField",
                        "name": "teams",
                        "plural": true,
                        "selections": (v3 /*: any*/),
                        "storageKey": null
                    }
                ]
            }
        ],
        "type": "RootQuery",
        "abstractKey": null
    } as any;
})();
(node as any).hash = '7ad7e6bbe2a1396c5c76657ffc4f94e4';
export default node;
