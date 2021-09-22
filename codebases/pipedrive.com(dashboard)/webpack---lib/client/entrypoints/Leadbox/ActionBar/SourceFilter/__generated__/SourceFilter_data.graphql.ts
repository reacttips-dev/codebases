/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type SourceFilter_data = {
    readonly " $fragmentRefs": FragmentRefs<"useSourceFilter_data" | "SourceFilterContent_data">;
    readonly " $refType": "SourceFilter_data";
};
export type SourceFilter_data$data = SourceFilter_data;
export type SourceFilter_data$key = {
    readonly " $data"?: SourceFilter_data$data;
    readonly " $fragmentRefs": FragmentRefs<"SourceFilter_data">;
};



const node: ReaderFragment = (function () {
    var v0 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "iconName",
        "storageKey": null
    } as any;
    return {
        "argumentDefinitions": [],
        "kind": "Fragment",
        "metadata": null,
        "name": "SourceFilter_data",
        "selections": [
            {
                "kind": "InlineDataFragmentSpread",
                "name": "useSourceFilter_data",
                "selections": [
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "LeadSource",
                        "kind": "LinkedField",
                        "name": "leadSources",
                        "plural": true,
                        "selections": [
                            {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "id",
                                "storageKey": null
                            },
                            {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "name",
                                "storageKey": null
                            },
                            (v0 /*: any*/),
                            {
                                "kind": "InlineDataFragmentSpread",
                                "name": "useSourceFilter_source",
                                "selections": [
                                    (v0 /*: any*/)
                                ]
                            },
                            {
                                "args": null,
                                "kind": "FragmentSpread",
                                "name": "SourceLabel_source"
                            }
                        ],
                        "storageKey": null
                    }
                ]
            },
            {
                "args": null,
                "kind": "FragmentSpread",
                "name": "SourceFilterContent_data"
            }
        ],
        "type": "RootQuery",
        "abstractKey": null
    } as any;
})();
(node as any).hash = '1c6abb1d91ebd61e0e2dcd1a8c501b71';
export default node;
