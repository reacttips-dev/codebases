/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type SourceFilterContent_data = {
    readonly " $fragmentRefs": FragmentRefs<"useSourceFilter_data">;
    readonly " $refType": "SourceFilterContent_data";
};
export type SourceFilterContent_data$data = SourceFilterContent_data;
export type SourceFilterContent_data$key = {
    readonly " $data"?: SourceFilterContent_data$data;
    readonly " $fragmentRefs": FragmentRefs<"SourceFilterContent_data">;
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
        "name": "SourceFilterContent_data",
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
            }
        ],
        "type": "RootQuery",
        "abstractKey": null
    } as any;
})();
(node as any).hash = 'fc38bd74ade434509ca47f3f11117c9f';
export default node;
