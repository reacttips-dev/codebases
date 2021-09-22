/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldDefinitionEntityType = "lead" | "organization" | "person" | "%future added value";
export type SortDirection = "ASC" | "DESC" | "%future added value";
export type LeadCustomViewModal_customView = {
    readonly customViewId: string;
    readonly fields: ReadonlyArray<{
        readonly fieldDefinition: {
            readonly entityType: FieldDefinitionEntityType | null;
            readonly key: string | null;
        } | null;
        readonly width: number | null;
        readonly sortDirection: SortDirection | null;
        readonly sortSequence: number | null;
    }> | null;
    readonly filter: {
        readonly id: string;
    } | null;
    readonly " $refType": "LeadCustomViewModal_customView";
};
export type LeadCustomViewModal_customView$data = LeadCustomViewModal_customView;
export type LeadCustomViewModal_customView$key = {
    readonly " $data"?: LeadCustomViewModal_customView$data;
    readonly " $fragmentRefs": FragmentRefs<"LeadCustomViewModal_customView">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LeadCustomViewModal_customView",
    "selections": [
        {
            "alias": "customViewId",
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
        },
        {
            "alias": null,
            "args": null,
            "concreteType": "CustomViewField",
            "kind": "LinkedField",
            "name": "fields",
            "plural": true,
            "selections": [
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
                    "name": "width",
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
            "alias": null,
            "args": null,
            "concreteType": "Filter",
            "kind": "LinkedField",
            "name": "filter",
            "plural": false,
            "selections": [
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                }
            ],
            "storageKey": null
        }
    ],
    "type": "CustomView",
    "abstractKey": null
} as any;
(node as any).hash = 'a72dc69d2b4f85b3aa65b9517f4dc2ce';
export default node;
