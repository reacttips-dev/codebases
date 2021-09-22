/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LeadStatus = "ALL" | "ARCHIVED" | "%future added value";
export type SortDirection = "ASC" | "DESC" | "%future added value";
export type LeadsFilter = {
    filter?: string | null;
    labels?: Array<string> | null;
    owner?: string | null;
    sources?: Array<string> | null;
    useStoredFilters?: boolean | null;
};
export type LeadsSort = {
    direction: SortDirection;
    id: string;
};
export type ListViewPaginationQueryVariables = {
    status: LeadStatus;
    first: number;
    after?: string | null;
    filter?: LeadsFilter | null;
    sort?: Array<LeadsSort> | null;
};
export type ListViewPaginationQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"ListView_data">;
};
export type ListViewPaginationQuery = {
    readonly response: ListViewPaginationQueryResponse;
    readonly variables: ListViewPaginationQueryVariables;
};



/*
query ListViewPaginationQuery(
  $status: LeadStatus!
  $first: Int!
  $after: String
  $filter: LeadsFilter
  $sort: [LeadsSort!]
) {
  ...ListView_data_2ekLZe
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

fragment LeadCustomViewModal_customView on CustomView {
  customViewId: id(opaque: false)
  fields {
    fieldDefinition {
      entityType
      key
    }
    width
    sortDirection
    sortSequence
    id
  }
  filter {
    id
  }
}

fragment LeadDetailLoader_data on LeadTableConnection {
  activeCustomView {
    id
  }
  edges {
    node {
      lead {
        id
        uuid: id(opaque: false)
        wasSeen
      }
      id
    }
  }
}

fragment ListViewContent_customView on CustomView {
  id
  internalID: id(opaque: false)
  fields {
    id
    width
    fieldDefinition {
      name
      entityType
      key
    }
  }
  ...LeadCustomViewModal_customView
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

fragment ListView_data_2ekLZe on RootQuery {
  leadView(first: $first, after: $after, status: $status, filter: $filter, sort: $sort) {
    activeCustomView {
      fields {
        __typename
        id
      }
      ...ListViewContent_customView
      id
    }
    edges {
      node {
        ...ListViewContent_rows
        id
        __typename
      }
      cursor
    }
    ...LeadDetailLoader_data
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "after"
    } as any, v1 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "filter"
    } as any, v2 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "first"
    } as any, v3 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "sort"
    } as any, v4 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "status"
    } as any, v5 = [
        {
            "kind": "Variable",
            "name": "after",
            "variableName": "after"
        } as any,
        {
            "kind": "Variable",
            "name": "filter",
            "variableName": "filter"
        } as any,
        {
            "kind": "Variable",
            "name": "first",
            "variableName": "first"
        } as any,
        {
            "kind": "Variable",
            "name": "sort",
            "variableName": "sort"
        } as any,
        {
            "kind": "Variable",
            "name": "status",
            "variableName": "status"
        } as any
    ], v6 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
    } as any, v7 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v8 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
    } as any, v9 = [
        {
            "kind": "Literal",
            "name": "opaque",
            "value": false
        } as any
    ], v10 = [
        (v7 /*: any*/)
    ], v11 = {
        "alias": "uuid",
        "args": (v9 /*: any*/),
        "kind": "ScalarField",
        "name": "id",
        "storageKey": "id(opaque:false)"
    } as any, v12 = [
        {
            "alias": "text",
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
        } as any
    ], v13 = [
        (v7 /*: any*/),
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "label",
            "storageKey": null
        } as any
    ], v14 = [
        (v8 /*: any*/),
        (v7 /*: any*/)
    ];
    return {
        "fragment": {
            "argumentDefinitions": [
                (v0 /*: any*/),
                (v1 /*: any*/),
                (v2 /*: any*/),
                (v3 /*: any*/),
                (v4 /*: any*/)
            ],
            "kind": "Fragment",
            "metadata": null,
            "name": "ListViewPaginationQuery",
            "selections": [
                {
                    "args": (v5 /*: any*/),
                    "kind": "FragmentSpread",
                    "name": "ListView_data"
                }
            ],
            "type": "RootQuery",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": [
                (v4 /*: any*/),
                (v2 /*: any*/),
                (v0 /*: any*/),
                (v1 /*: any*/),
                (v3 /*: any*/)
            ],
            "kind": "Operation",
            "name": "ListViewPaginationQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v5 /*: any*/),
                    "concreteType": "LeadTableConnection",
                    "kind": "LinkedField",
                    "name": "leadView",
                    "plural": false,
                    "selections": [
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "CustomView",
                            "kind": "LinkedField",
                            "name": "activeCustomView",
                            "plural": false,
                            "selections": [
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "CustomViewField",
                                    "kind": "LinkedField",
                                    "name": "fields",
                                    "plural": true,
                                    "selections": [
                                        (v6 /*: any*/),
                                        (v7 /*: any*/),
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
                                                (v8 /*: any*/),
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
                                (v7 /*: any*/),
                                {
                                    "alias": "internalID",
                                    "args": (v9 /*: any*/),
                                    "kind": "ScalarField",
                                    "name": "id",
                                    "storageKey": "id(opaque:false)"
                                },
                                {
                                    "alias": "customViewId",
                                    "args": (v9 /*: any*/),
                                    "kind": "ScalarField",
                                    "name": "id",
                                    "storageKey": "id(opaque:false)"
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Filter",
                                    "kind": "LinkedField",
                                    "name": "filter",
                                    "plural": false,
                                    "selections": (v10 /*: any*/),
                                    "storageKey": null
                                }
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
                                        (v11 /*: any*/),
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Lead",
                                            "kind": "LinkedField",
                                            "name": "lead",
                                            "plural": false,
                                            "selections": [
                                                (v7 /*: any*/),
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "wasSeen",
                                                    "storageKey": null
                                                },
                                                (v11 /*: any*/),
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
                                                        (v7 /*: any*/)
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
                                                    "selections": (v10 /*: any*/),
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
                                                        (v6 /*: any*/),
                                                        {
                                                            "kind": "TypeDiscriminator",
                                                            "abstractKey": "__isField"
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v12 /*: any*/),
                                                            "type": "FieldText",
                                                            "abstractKey": null
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v12 /*: any*/),
                                                            "type": "FieldLargeText",
                                                            "abstractKey": null
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v12 /*: any*/),
                                                            "type": "FieldPhone",
                                                            "abstractKey": null
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v12 /*: any*/),
                                                            "type": "FieldAutocomplete",
                                                            "abstractKey": null
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v12 /*: any*/),
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
                                                                        (v7 /*: any*/),
                                                                        (v8 /*: any*/),
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
                                                                        (v8 /*: any*/),
                                                                        {
                                                                            "alias": null,
                                                                            "args": null,
                                                                            "kind": "ScalarField",
                                                                            "name": "iconName",
                                                                            "storageKey": null
                                                                        },
                                                                        (v7 /*: any*/)
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
                                                                    "selections": (v13 /*: any*/),
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
                                                                    "selections": (v13 /*: any*/),
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
                                                                    "selections": (v14 /*: any*/),
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
                                                                    "selections": (v14 /*: any*/),
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
                                                                    "selections": (v14 /*: any*/),
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
                                                                                (v7 /*: any*/)
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
                                        },
                                        (v7 /*: any*/),
                                        (v6 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "cursor",
                                    "storageKey": null
                                }
                            ],
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "PageInfo",
                            "kind": "LinkedField",
                            "name": "pageInfo",
                            "plural": false,
                            "selections": [
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "endCursor",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "hasNextPage",
                                    "storageKey": null
                                }
                            ],
                            "storageKey": null
                        }
                    ],
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": (v5 /*: any*/),
                    "filters": [
                        "status",
                        "filter",
                        "sort"
                    ],
                    "handle": "connection",
                    "key": "ListView_leadView",
                    "kind": "LinkedHandle",
                    "name": "leadView"
                }
            ]
        },
        "params": {
            "cacheID": "05ed507ddc9561be6da2b303b9f593b7",
            "id": null,
            "metadata": {},
            "name": "ListViewPaginationQuery",
            "operationKind": "query",
            "text": "query ListViewPaginationQuery(\n  $status: LeadStatus!\n  $first: Int!\n  $after: String\n  $filter: LeadsFilter\n  $sort: [LeadsSort!]\n) {\n  ...ListView_data_2ekLZe\n}\n\nfragment FieldActivity_data on Lead {\n  upcomingActivity {\n    dueDate\n    dueTime\n    type\n    id\n  }\n}\n\nfragment FieldComponent_field on Field {\n  __isField: __typename\n  __typename\n  ... on FieldText {\n    text: value\n  }\n  ... on FieldLargeText {\n    text: value\n  }\n  ... on FieldPhone {\n    text: value\n  }\n  ... on FieldAutocomplete {\n    text: value\n  }\n  ... on FieldAddress {\n    text: value\n  }\n  ... on FieldVisibility {\n    text: label\n  }\n  ... on FieldNumeric {\n    float: value\n  }\n  ... on FieldInteger {\n    number: value\n  }\n  ... on FieldDate {\n    ...FieldDate_data\n  }\n  ... on FieldDateRange {\n    ...FieldDateRange_data\n  }\n  ... on FieldDateTime {\n    ...FieldDateTime_data\n  }\n  ... on FieldTime {\n    ...FieldTime_data\n  }\n  ... on FieldTimeRange {\n    ...FieldTimeRange_data\n  }\n  ... on FieldLabels {\n    ...FieldLabels_data\n  }\n  ... on FieldLeadSource {\n    ...FieldSource_data\n  }\n  ... on FieldSingleOption {\n    selectedOption: selected {\n      id\n      label\n    }\n  }\n  ... on FieldMultipleOptions {\n    ...FieldMultipleOptions_data\n  }\n  ... on FieldUser {\n    user {\n      name\n      id\n    }\n  }\n  ... on FieldPerson {\n    person {\n      name\n      id\n    }\n  }\n  ... on FieldOrganization {\n    organization {\n      name\n      id\n    }\n  }\n  ... on FieldActivity {\n    __typename\n  }\n  ... on FieldMonetary {\n    ...FieldMonetary_data\n  }\n}\n\nfragment FieldComponent_lead on Lead {\n  wasSeen\n  ...FieldActivity_data\n}\n\nfragment FieldDateRange_data on FieldDateRange {\n  startDate: start\n  endDate: end\n}\n\nfragment FieldDateTime_data on FieldDateTime {\n  dateTime: value\n}\n\nfragment FieldDate_data on FieldDate {\n  date: value\n}\n\nfragment FieldLabels_data on FieldLabels {\n  labels {\n    id\n    name\n    colorName\n  }\n}\n\nfragment FieldMonetary_data on FieldMonetary {\n  monetary: value {\n    amount\n    currency {\n      code\n      id\n    }\n  }\n}\n\nfragment FieldMultipleOptions_data on FieldMultipleOptions {\n  selectedOptions: selected {\n    id\n    label\n  }\n}\n\nfragment FieldSource_data on FieldLeadSource {\n  leadSource {\n    name\n    iconName\n    id\n  }\n}\n\nfragment FieldTimeRange_data on FieldTimeRange {\n  startTime: start\n  endTime: end\n}\n\nfragment FieldTime_data on FieldTime {\n  time: value\n}\n\nfragment LeadCustomViewModal_customView on CustomView {\n  customViewId: id(opaque: false)\n  fields {\n    fieldDefinition {\n      entityType\n      key\n    }\n    width\n    sortDirection\n    sortSequence\n    id\n  }\n  filter {\n    id\n  }\n}\n\nfragment LeadDetailLoader_data on LeadTableConnection {\n  activeCustomView {\n    id\n  }\n  edges {\n    node {\n      lead {\n        id\n        uuid: id(opaque: false)\n        wasSeen\n      }\n      id\n    }\n  }\n}\n\nfragment ListViewContent_customView on CustomView {\n  id\n  internalID: id(opaque: false)\n  fields {\n    id\n    width\n    fieldDefinition {\n      name\n      entityType\n      key\n    }\n  }\n  ...LeadCustomViewModal_customView\n}\n\nfragment ListViewContent_rows on LeadTableRow {\n  uuid: id(opaque: false)\n  lead {\n    id\n    wasSeen\n    uuid: id(opaque: false)\n    isArchived\n    ...FieldComponent_lead\n  }\n  cells {\n    customViewField {\n      id\n    }\n    field {\n      __typename\n      ...FieldComponent_field\n    }\n  }\n}\n\nfragment ListView_data_2ekLZe on RootQuery {\n  leadView(first: $first, after: $after, status: $status, filter: $filter, sort: $sort) {\n    activeCustomView {\n      fields {\n        __typename\n        id\n      }\n      ...ListViewContent_customView\n      id\n    }\n    edges {\n      node {\n        ...ListViewContent_rows\n        id\n        __typename\n      }\n      cursor\n    }\n    ...LeadDetailLoader_data\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = 'ce7cae2959204be6245bf186ddfe69dc';
export default node;
