/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LeadDetailLoader_data = {
    readonly activeCustomView: {
        readonly id: string;
    } | null;
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly lead: {
                readonly id: string;
                readonly uuid: string;
                readonly wasSeen: boolean | null;
            } | null;
        } | null;
    } | null> | null;
    readonly " $refType": "LeadDetailLoader_data";
};
export type LeadDetailLoader_data$data = LeadDetailLoader_data;
export type LeadDetailLoader_data$key = {
    readonly " $data"?: LeadDetailLoader_data$data;
    readonly " $fragmentRefs": FragmentRefs<"LeadDetailLoader_data">;
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
        "name": "LeadDetailLoader_data",
        "selections": [
            {
                "alias": null,
                "args": null,
                "concreteType": "CustomView",
                "kind": "LinkedField",
                "name": "activeCustomView",
                "plural": false,
                "selections": [
                    (v0 /*: any*/)
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
                            {
                                "alias": null,
                                "args": null,
                                "concreteType": "Lead",
                                "kind": "LinkedField",
                                "name": "lead",
                                "plural": false,
                                "selections": [
                                    (v0 /*: any*/),
                                    {
                                        "alias": "uuid",
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
                                        "kind": "ScalarField",
                                        "name": "wasSeen",
                                        "storageKey": null
                                    }
                                ],
                                "storageKey": null
                            }
                        ],
                        "storageKey": null
                    }
                ],
                "storageKey": null
            }
        ],
        "type": "LeadTableConnection",
        "abstractKey": null
    } as any;
})();
(node as any).hash = 'e09c3b2e13b81dbc0ecad03a7459e31c';
export default node;
