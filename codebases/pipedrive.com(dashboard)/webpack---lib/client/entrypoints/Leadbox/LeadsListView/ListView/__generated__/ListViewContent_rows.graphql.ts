/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type ListViewContent_rows = ReadonlyArray<{
    readonly uuid: string;
    readonly lead: {
        readonly id: string;
        readonly wasSeen: boolean | null;
        readonly uuid: string;
        readonly isArchived: boolean | null;
        readonly " $fragmentRefs": FragmentRefs<"FieldComponent_lead">;
    } | null;
    readonly cells: ReadonlyArray<{
        readonly customViewField: {
            readonly id: string;
        } | null;
        readonly field: {
            readonly " $fragmentRefs": FragmentRefs<"FieldComponent_field">;
        } | null;
    }> | null;
    readonly " $refType": "ListViewContent_rows";
}>;
export type ListViewContent_rows$data = ListViewContent_rows;
export type ListViewContent_rows$key = ReadonlyArray<{
    readonly " $data"?: ListViewContent_rows$data;
    readonly " $fragmentRefs": FragmentRefs<"ListViewContent_rows">;
}>;



const node: ReaderFragment = (function () {
    var v0 = {
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
    } as any, v1 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v2 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "wasSeen",
        "storageKey": null
    } as any, v3 = [
        {
            "alias": "text",
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
        } as any
    ], v4 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
    } as any, v5 = [
        (v1 /*: any*/),
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "label",
            "storageKey": null
        } as any
    ], v6 = [
        (v4 /*: any*/)
    ];
    return {
        "argumentDefinitions": [],
        "kind": "Fragment",
        "metadata": {
            "plural": true
        },
        "name": "ListViewContent_rows",
        "selections": [
            (v0 /*: any*/),
            {
                "alias": null,
                "args": null,
                "concreteType": "Lead",
                "kind": "LinkedField",
                "name": "lead",
                "plural": false,
                "selections": [
                    (v1 /*: any*/),
                    (v2 /*: any*/),
                    (v0 /*: any*/),
                    {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isArchived",
                        "storageKey": null
                    },
                    {
                        "kind": "InlineDataFragmentSpread",
                        "name": "FieldComponent_lead",
                        "selections": [
                            (v2 /*: any*/),
                            {
                                "kind": "InlineDataFragmentSpread",
                                "name": "FieldActivity_data",
                                "selections": [
                                    {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Activity",
                                        "kind": "LinkedField",
                                        "name": "upcomingActivity",
                                        "plural": false,
                                        "selections": [
                                            {
                                                "alias": null,
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "dueDate",
                                                "storageKey": null
                                            },
                                            {
                                                "alias": null,
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "dueTime",
                                                "storageKey": null
                                            },
                                            {
                                                "alias": null,
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "type",
                                                "storageKey": null
                                            }
                                        ],
                                        "storageKey": null
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "storageKey": null
            },
            {
                "alias": null,
                "args": null,
                "concreteType": "LeadTableCell",
                "kind": "LinkedField",
                "name": "cells",
                "plural": true,
                "selections": [
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "CustomViewField",
                        "kind": "LinkedField",
                        "name": "customViewField",
                        "plural": false,
                        "selections": [
                            (v1 /*: any*/)
                        ],
                        "storageKey": null
                    },
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "field",
                        "plural": false,
                        "selections": [
                            {
                                "kind": "InlineDataFragmentSpread",
                                "name": "FieldComponent_field",
                                "selections": [
                                    {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "__typename",
                                        "storageKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": (v3 /*: any*/),
                                        "type": "FieldText",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": (v3 /*: any*/),
                                        "type": "FieldLargeText",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": (v3 /*: any*/),
                                        "type": "FieldPhone",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": (v3 /*: any*/),
                                        "type": "FieldAutocomplete",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": (v3 /*: any*/),
                                        "type": "FieldAddress",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "alias": "text",
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "label",
                                                "storageKey": null
                                            }
                                        ],
                                        "type": "FieldVisibility",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "alias": "float",
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "value",
                                                "storageKey": null
                                            }
                                        ],
                                        "type": "FieldNumeric",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "alias": "number",
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "value",
                                                "storageKey": null
                                            }
                                        ],
                                        "type": "FieldInteger",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "FieldDate_data",
                                                "selections": [
                                                    {
                                                        "alias": "date",
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "value",
                                                        "storageKey": null
                                                    }
                                                ]
                                            }
                                        ],
                                        "type": "FieldDate",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "FieldDateRange_data",
                                                "selections": [
                                                    {
                                                        "alias": "startDate",
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "start",
                                                        "storageKey": null
                                                    },
                                                    {
                                                        "alias": "endDate",
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "end",
                                                        "storageKey": null
                                                    }
                                                ]
                                            }
                                        ],
                                        "type": "FieldDateRange",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "FieldDateTime_data",
                                                "selections": [
                                                    {
                                                        "alias": "dateTime",
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "value",
                                                        "storageKey": null
                                                    }
                                                ]
                                            }
                                        ],
                                        "type": "FieldDateTime",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "FieldTime_data",
                                                "selections": [
                                                    {
                                                        "alias": "time",
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "value",
                                                        "storageKey": null
                                                    }
                                                ]
                                            }
                                        ],
                                        "type": "FieldTime",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "FieldTimeRange_data",
                                                "selections": [
                                                    {
                                                        "alias": "startTime",
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "start",
                                                        "storageKey": null
                                                    },
                                                    {
                                                        "alias": "endTime",
                                                        "args": null,
                                                        "kind": "ScalarField",
                                                        "name": "end",
                                                        "storageKey": null
                                                    }
                                                ]
                                            }
                                        ],
                                        "type": "FieldTimeRange",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "FieldLabels_data",
                                                "selections": [
                                                    {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": "Label",
                                                        "kind": "LinkedField",
                                                        "name": "labels",
                                                        "plural": true,
                                                        "selections": [
                                                            (v1 /*: any*/),
                                                            (v4 /*: any*/),
                                                            {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "colorName",
                                                                "storageKey": null
                                                            }
                                                        ],
                                                        "storageKey": null
                                                    }
                                                ]
                                            }
                                        ],
                                        "type": "FieldLabels",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "FieldSource_data",
                                                "selections": [
                                                    {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": "LeadSource",
                                                        "kind": "LinkedField",
                                                        "name": "leadSource",
                                                        "plural": false,
                                                        "selections": [
                                                            (v4 /*: any*/),
                                                            {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "iconName",
                                                                "storageKey": null
                                                            }
                                                        ],
                                                        "storageKey": null
                                                    }
                                                ]
                                            }
                                        ],
                                        "type": "FieldLeadSource",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "alias": "selectedOption",
                                                "args": null,
                                                "concreteType": "FieldOption",
                                                "kind": "LinkedField",
                                                "name": "selected",
                                                "plural": false,
                                                "selections": (v5 /*: any*/),
                                                "storageKey": null
                                            }
                                        ],
                                        "type": "FieldSingleOption",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "FieldMultipleOptions_data",
                                                "selections": [
                                                    {
                                                        "alias": "selectedOptions",
                                                        "args": null,
                                                        "concreteType": "FieldOption",
                                                        "kind": "LinkedField",
                                                        "name": "selected",
                                                        "plural": true,
                                                        "selections": (v5 /*: any*/),
                                                        "storageKey": null
                                                    }
                                                ]
                                            }
                                        ],
                                        "type": "FieldMultipleOptions",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "User",
                                                "kind": "LinkedField",
                                                "name": "user",
                                                "plural": false,
                                                "selections": (v6 /*: any*/),
                                                "storageKey": null
                                            }
                                        ],
                                        "type": "FieldUser",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "Person",
                                                "kind": "LinkedField",
                                                "name": "person",
                                                "plural": false,
                                                "selections": (v6 /*: any*/),
                                                "storageKey": null
                                            }
                                        ],
                                        "type": "FieldPerson",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "Organization",
                                                "kind": "LinkedField",
                                                "name": "organization",
                                                "plural": false,
                                                "selections": (v6 /*: any*/),
                                                "storageKey": null
                                            }
                                        ],
                                        "type": "FieldOrganization",
                                        "abstractKey": null
                                    },
                                    {
                                        "kind": "InlineFragment",
                                        "selections": [
                                            {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "FieldMonetary_data",
                                                "selections": [
                                                    {
                                                        "alias": "monetary",
                                                        "args": null,
                                                        "concreteType": "Money",
                                                        "kind": "LinkedField",
                                                        "name": "value",
                                                        "plural": false,
                                                        "selections": [
                                                            {
                                                                "alias": null,
                                                                "args": null,
                                                                "kind": "ScalarField",
                                                                "name": "amount",
                                                                "storageKey": null
                                                            },
                                                            {
                                                                "alias": null,
                                                                "args": null,
                                                                "concreteType": "MoneyCurrency",
                                                                "kind": "LinkedField",
                                                                "name": "currency",
                                                                "plural": false,
                                                                "selections": [
                                                                    {
                                                                        "alias": null,
                                                                        "args": null,
                                                                        "kind": "ScalarField",
                                                                        "name": "code",
                                                                        "storageKey": null
                                                                    }
                                                                ],
                                                                "storageKey": null
                                                            }
                                                        ],
                                                        "storageKey": null
                                                    }
                                                ]
                                            }
                                        ],
                                        "type": "FieldMonetary",
                                        "abstractKey": null
                                    }
                                ]
                            }
                        ],
                        "storageKey": null
                    }
                ],
                "storageKey": null
            }
        ],
        "type": "LeadTableRow",
        "abstractKey": null
    } as any;
})();
(node as any).hash = '3bd5a462cbe0982f9a9e1acd487a9cd9';
export default node;
