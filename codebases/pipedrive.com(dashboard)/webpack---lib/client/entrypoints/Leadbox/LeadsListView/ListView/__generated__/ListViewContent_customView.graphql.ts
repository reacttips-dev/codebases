/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldDefinitionEntityType = "lead" | "organization" | "person" | "%future added value";
export type ListViewContent_customView = {
    readonly id: string;
    readonly internalID: string;
    readonly fields: ReadonlyArray<{
        readonly id: string;
        readonly width: number | null;
        readonly fieldDefinition: {
            readonly name: string | null;
            readonly entityType: FieldDefinitionEntityType | null;
            readonly key: string | null;
        } | null;
    }> | null;
    readonly " $fragmentRefs": FragmentRefs<"LeadCustomViewModal_customView">;
    readonly " $refType": "ListViewContent_customView";
};
export type ListViewContent_customView$data = ListViewContent_customView;
export type ListViewContent_customView$key = {
    readonly " $data"?: ListViewContent_customView$data;
    readonly " $fragmentRefs": FragmentRefs<"ListViewContent_customView">;
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
        "name": "ListViewContent_customView",
        "selections": [
            (v0 /*: any*/),
            {
                "alias": "internalID",
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
                    (v0 /*: any*/),
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
                    }
                ],
                "storageKey": null
            },
            {
                "args": null,
                "kind": "FragmentSpread",
                "name": "LeadCustomViewModal_customView"
            }
        ],
        "type": "CustomView",
        "abstractKey": null
    } as any;
})();
(node as any).hash = 'e3d7b940f1053be975a9b7d54a884a0f';
export default node;
