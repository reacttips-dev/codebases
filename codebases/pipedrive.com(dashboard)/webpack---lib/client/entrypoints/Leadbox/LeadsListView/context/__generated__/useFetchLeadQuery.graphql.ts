/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type useFetchLeadQueryVariables = {
    leadInternalId: string;
    customViewId: string;
};
export type useFetchLeadQueryResponse = {
    readonly leadTableRow: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ListViewContent_rows">;
    } | null;
};
export type useFetchLeadQuery = {
    readonly response: useFetchLeadQueryResponse;
    readonly variables: useFetchLeadQueryVariables;
};



/*
query useFetchLeadQuery(
  $leadInternalId: String!
  $customViewId: ID!
) {
  leadTableRow(leadInternalId: $leadInternalId, customViewId: $customViewId) {
    id
    ...ListViewContent_rows
  }
}

fragment FieldActivity_data on Lead {
  upcomingActivity {
    dueDate
    dueTime
    type
    id
  }
}

fragment FieldComponent_field on Field {
  __isField: __typename
  __typename
  ... on FieldText {
    text: value
  }
  ... on FieldLargeText {
    text: value
  }
  ... on FieldPhone {
    text: value
  }
  ... on FieldAutocomplete {
    text: value
  }
  ... on FieldAddress {
    text: value
  }
  ... on FieldVisibility {
    text: label
  }
  ... on FieldNumeric {
    float: value
  }
  ... on FieldInteger {
    number: value
  }
  ... on FieldDate {
    ...FieldDate_data
  }
  ... on FieldDateRange {
    ...FieldDateRange_data
  }
  ... on FieldDateTime {
    ...FieldDateTime_data
  }
  ... on FieldTime {
    ...FieldTime_data
  }
  ... on FieldTimeRange {
    ...FieldTimeRange_data
  }
  ... on FieldLabels {
    ...FieldLabels_data
  }
  ... on FieldLeadSource {
    ...FieldSource_data
  }
  ... on FieldSingleOption {
    selectedOption: selected {
      id
      label
    }
  }
  ... on FieldMultipleOptions {
    ...FieldMultipleOptions_data
  }
  ... on FieldUser {
    user {
      name
      id
    }
  }
  ... on FieldPerson {
    person {
      name
      id
    }
  }
  ... on FieldOrganization {
    organization {
      name
      id
    }
  }
  ... on FieldActivity {
    __typename
  }
  ... on FieldMonetary {
    ...FieldMonetary_data
  }
}

fragment FieldComponent_lead on Lead {
  wasSeen
  ...FieldActivity_data
}

fragment FieldDateRange_data on FieldDateRange {
  startDate: start
  endDate: end
}

fragment FieldDateTime_data on FieldDateTime {
  dateTime: value
}

fragment FieldDate_data on FieldDate {
  date: value
}

fragment FieldLabels_data on FieldLabels {
  labels {
    id
    name
    colorName
  }
}

fragment FieldMonetary_data on FieldMonetary {
  monetary: value {
    amount
    currency {
      code
      id
    }
  }
}

fragment FieldMultipleOptions_data on FieldMultipleOptions {
  selectedOptions: selected {
    id
    label
  }
}

fragment FieldSource_data on FieldLeadSource {
  leadSource {
    name
    iconName
    id
  }
}

fragment FieldTimeRange_data on FieldTimeRange {
  startTime: start
  endTime: end
}

fragment FieldTime_data on FieldTime {
  time: value
}

fragment ListViewContent_rows on LeadTableRow {
  uuid: id(opaque: false)
  lead {
    id
    wasSeen
    uuid: id(opaque: false)
    isArchived
    ...FieldComponent_lead
  }
  cells {
    customViewField {
      id
    }
    field {
      __typename
      ...FieldComponent_field
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "customViewId"
    } as any, v1 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "leadInternalId"
    } as any, v2 = [
        {
            "kind": "Variable",
            "name": "customViewId",
            "variableName": "customViewId"
        } as any,
        {
            "kind": "Variable",
            "name": "leadInternalId",
            "variableName": "leadInternalId"
        } as any
    ], v3 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v4 = {
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
    } as any, v5 = [
        {
            "alias": "text",
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
        } as any
    ], v6 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
    } as any, v7 = [
        (v3 /*: any*/),
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "label",
            "storageKey": null
        } as any
    ], v8 = [
        (v6 /*: any*/),
        (v3 /*: any*/)
    ];
    return {
        "fragment": {
            "argumentDefinitions": [
                (v0 /*: any*/),
                (v1 /*: any*/)
            ],
            "kind": "Fragment",
            "metadata": null,
            "name": "useFetchLeadQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v2 /*: any*/),
                    "concreteType": "LeadTableRow",
                    "kind": "LinkedField",
                    "name": "leadTableRow",
                    "plural": false,
                    "selections": [
                        (v3 /*: any*/),
                        {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "ListViewContent_rows"
                        }
                    ],
                    "storageKey": null
                }
            ],
            "type": "RootQuery",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": [
                (v1 /*: any*/),
                (v0 /*: any*/)
            ],
            "kind": "Operation",
            "name": "useFetchLeadQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v2 /*: any*/),
                    "concreteType": "LeadTableRow",
                    "kind": "LinkedField",
                    "name": "leadTableRow",
                    "plural": false,
                    "selections": [
                        (v3 /*: any*/),
                        (v4 /*: any*/),
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "Lead",
                            "kind": "LinkedField",
                            "name": "lead",
                            "plural": false,
                            "selections": [
                                (v3 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "wasSeen",
                                    "storageKey": null
                                },
                                (v4 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isArchived",
                                    "storageKey": null
                                },
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
                                        },
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
                                        (v3 /*: any*/)
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
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "__typename",
                                            "storageKey": null
                                        },
                                        {
                                            "kind": "TypeDiscriminator",
                                            "abstractKey": "__isField"
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": (v5 /*: any*/),
                                            "type": "FieldText",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": (v5 /*: any*/),
                                            "type": "FieldLargeText",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": (v5 /*: any*/),
                                            "type": "FieldPhone",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": (v5 /*: any*/),
                                            "type": "FieldAutocomplete",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": (v5 /*: any*/),
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
                                                    "alias": "date",
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "value",
                                                    "storageKey": null
                                                }
                                            ],
                                            "type": "FieldDate",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
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
                                            ],
                                            "type": "FieldDateRange",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": [
                                                {
                                                    "alias": "dateTime",
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "value",
                                                    "storageKey": null
                                                }
                                            ],
                                            "type": "FieldDateTime",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": [
                                                {
                                                    "alias": "time",
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "value",
                                                    "storageKey": null
                                                }
                                            ],
                                            "type": "FieldTime",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
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
                                            ],
                                            "type": "FieldTimeRange",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": [
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "Label",
                                                    "kind": "LinkedField",
                                                    "name": "labels",
                                                    "plural": true,
                                                    "selections": [
                                                        (v3 /*: any*/),
                                                        (v6 /*: any*/),
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
                                            ],
                                            "type": "FieldLabels",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": [
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "LeadSource",
                                                    "kind": "LinkedField",
                                                    "name": "leadSource",
                                                    "plural": false,
                                                    "selections": [
                                                        (v6 /*: any*/),
                                                        {
                                                            "alias": null,
                                                            "args": null,
                                                            "kind": "ScalarField",
                                                            "name": "iconName",
                                                            "storageKey": null
                                                        },
                                                        (v3 /*: any*/)
                                                    ],
                                                    "storageKey": null
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
                                                    "selections": (v7 /*: any*/),
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
                                                    "alias": "selectedOptions",
                                                    "args": null,
                                                    "concreteType": "FieldOption",
                                                    "kind": "LinkedField",
                                                    "name": "selected",
                                                    "plural": true,
                                                    "selections": (v7 /*: any*/),
                                                    "storageKey": null
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
                                                    "selections": (v8 /*: any*/),
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
                                                    "selections": (v8 /*: any*/),
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
                                                    "selections": (v8 /*: any*/),
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
                                                                },
                                                                (v3 /*: any*/)
                                                            ],
                                                            "storageKey": null
                                                        }
                                                    ],
                                                    "storageKey": null
                                                }
                                            ],
                                            "type": "FieldMonetary",
                                            "abstractKey": null
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
            ]
        },
        "params": {
            "cacheID": "6da20135f43877dd7844d884cda972f5",
            "id": null,
            "metadata": {},
            "name": "useFetchLeadQuery",
            "operationKind": "query",
            "text": "query useFetchLeadQuery(\n  $leadInternalId: String!\n  $customViewId: ID!\n) {\n  leadTableRow(leadInternalId: $leadInternalId, customViewId: $customViewId) {\n    id\n    ...ListViewContent_rows\n  }\n}\n\nfragment FieldActivity_data on Lead {\n  upcomingActivity {\n    dueDate\n    dueTime\n    type\n    id\n  }\n}\n\nfragment FieldComponent_field on Field {\n  __isField: __typename\n  __typename\n  ... on FieldText {\n    text: value\n  }\n  ... on FieldLargeText {\n    text: value\n  }\n  ... on FieldPhone {\n    text: value\n  }\n  ... on FieldAutocomplete {\n    text: value\n  }\n  ... on FieldAddress {\n    text: value\n  }\n  ... on FieldVisibility {\n    text: label\n  }\n  ... on FieldNumeric {\n    float: value\n  }\n  ... on FieldInteger {\n    number: value\n  }\n  ... on FieldDate {\n    ...FieldDate_data\n  }\n  ... on FieldDateRange {\n    ...FieldDateRange_data\n  }\n  ... on FieldDateTime {\n    ...FieldDateTime_data\n  }\n  ... on FieldTime {\n    ...FieldTime_data\n  }\n  ... on FieldTimeRange {\n    ...FieldTimeRange_data\n  }\n  ... on FieldLabels {\n    ...FieldLabels_data\n  }\n  ... on FieldLeadSource {\n    ...FieldSource_data\n  }\n  ... on FieldSingleOption {\n    selectedOption: selected {\n      id\n      label\n    }\n  }\n  ... on FieldMultipleOptions {\n    ...FieldMultipleOptions_data\n  }\n  ... on FieldUser {\n    user {\n      name\n      id\n    }\n  }\n  ... on FieldPerson {\n    person {\n      name\n      id\n    }\n  }\n  ... on FieldOrganization {\n    organization {\n      name\n      id\n    }\n  }\n  ... on FieldActivity {\n    __typename\n  }\n  ... on FieldMonetary {\n    ...FieldMonetary_data\n  }\n}\n\nfragment FieldComponent_lead on Lead {\n  wasSeen\n  ...FieldActivity_data\n}\n\nfragment FieldDateRange_data on FieldDateRange {\n  startDate: start\n  endDate: end\n}\n\nfragment FieldDateTime_data on FieldDateTime {\n  dateTime: value\n}\n\nfragment FieldDate_data on FieldDate {\n  date: value\n}\n\nfragment FieldLabels_data on FieldLabels {\n  labels {\n    id\n    name\n    colorName\n  }\n}\n\nfragment FieldMonetary_data on FieldMonetary {\n  monetary: value {\n    amount\n    currency {\n      code\n      id\n    }\n  }\n}\n\nfragment FieldMultipleOptions_data on FieldMultipleOptions {\n  selectedOptions: selected {\n    id\n    label\n  }\n}\n\nfragment FieldSource_data on FieldLeadSource {\n  leadSource {\n    name\n    iconName\n    id\n  }\n}\n\nfragment FieldTimeRange_data on FieldTimeRange {\n  startTime: start\n  endTime: end\n}\n\nfragment FieldTime_data on FieldTime {\n  time: value\n}\n\nfragment ListViewContent_rows on LeadTableRow {\n  uuid: id(opaque: false)\n  lead {\n    id\n    wasSeen\n    uuid: id(opaque: false)\n    isArchived\n    ...FieldComponent_lead\n  }\n  cells {\n    customViewField {\n      id\n    }\n    field {\n      __typename\n      ...FieldComponent_field\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '17ac142ab978b4b5d3452eeafd276726';
export default node;
