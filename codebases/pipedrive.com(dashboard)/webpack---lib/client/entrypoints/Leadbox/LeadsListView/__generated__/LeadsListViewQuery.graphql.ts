/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LeadStatus = "ALL" | "ARCHIVED" | "%future added value";
export type LeadsFilter = {
    filter?: string | null;
    labels?: Array<string> | null;
    owner?: string | null;
    sources?: Array<string> | null;
    useStoredFilters?: boolean | null;
};
export type LeadsListViewQueryVariables = {
    first: number;
    status: LeadStatus;
    filter?: LeadsFilter | null;
    teamsFeature: boolean;
};
export type LeadsListViewQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"Layout_data">;
};
export type LeadsListViewQuery = {
    readonly response: LeadsListViewQueryResponse;
    readonly variables: LeadsListViewQueryVariables;
};



/*
query LeadsListViewQuery(
  $first: Int!
  $status: LeadStatus!
  $filter: LeadsFilter
  $teamsFeature: Boolean!
) {
  ...Layout_data_3pRY86
}

fragment ActionBarAddLead_data_1UP9LE on RootQuery {
  ...SourceFilter_data
  ...LabelsFilter_data
  ...GlobalFilter_data_1UP9LE
}

fragment ActionBarAddLead_leadView on LeadTableConnection {
  totalCount: count
}

fragment ActionBar_data_1UP9LE on RootQuery {
  ...ActionBarAddLead_data_1UP9LE
  inboxCount: leadsCount(page: INBOX)
  archivedCount: leadsCount(page: ARCHIVE)
}

fragment ActionBar_leadView on LeadTableConnection {
  ...ActionBarAddLead_leadView
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

fragment FilterInitializer_activeFilters on LeadActiveFilters {
  sources {
    id
  }
  labels {
    id
  }
  filter {
    id
  }
  owner {
    id
  }
  user {
    id
  }
  team {
    id
  }
}

fragment GlobalFilter_data_1UP9LE on RootQuery {
  users {
    id
    legacyID: id(opaque: false)
    name
  }
  teams @include(if: $teamsFeature) {
    id
    legacyID: id(opaque: false)
    name
  }
  filters {
    id
    legacyID: id(opaque: false)
    name
    visibleTo
    user {
      id
      legacyID: id(opaque: false)
    }
    customView {
      legacyID: id(opaque: false)
      id
    }
  }
}

fragment Label_label on Label {
  colorName
  name
}

fragment LabelsFilter_data on RootQuery {
  labels {
    ...LabelsSelectPopover_allLabels
    ...Label_label
    id
    name
  }
}

fragment LabelsSelectDeleteConfirm_label on Label {
  legacyLabelID: id(opaque: false)
}

fragment LabelsSelectEdit_label on Label {
  id
  name
  colorName
  ...LabelsSelectDeleteConfirm_label
}

fragment LabelsSelectList_allLabels on Label {
  id
  name
  ...LabelsSelectOption_label
}

fragment LabelsSelectOption_label on Label {
  id
  name
  colorName
}

fragment LabelsSelectPopover_allLabels on Label {
  id
  ...LabelsSelectList_allLabels
  ...LabelsSelectEdit_label
}

fragment LayoutHeader_data_1UP9LE on RootQuery {
  ...ActionBar_data_1UP9LE
}

fragment LayoutHeader_leadView on LeadTableConnection {
  ...ActionBar_leadView
}

fragment Layout_data_3pRY86 on RootQuery {
  inboxCount: leadsCount(page: INBOX)
  archivedCount: leadsCount(page: ARCHIVE)
  ...LayoutHeader_data_1UP9LE
  ...ListView_data_3nDyVa
  leadView(first: $first, status: $status, filter: $filter) {
    count
    ...LayoutHeader_leadView
    ...ListProvider_data
    edges {
      __typename
      cursor
      node {
        __typename
        id
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
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

fragment ListProvider_data on LeadTableConnection {
  count
  activeCustomView {
    ...useSortColumns_customView
    id
  }
  activeFilters {
    ...FilterInitializer_activeFilters
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

fragment ListView_data_3nDyVa on RootQuery {
  leadView(first: $first, status: $status, filter: $filter) {
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

fragment SourceFilterContent_data on RootQuery {
  ...useSourceFilter_data
}

fragment SourceFilter_data on RootQuery {
  ...useSourceFilter_data
  ...SourceFilterContent_data
}

fragment SourceLabel_source on LeadSource {
  name
  iconName
}

fragment useSortColumns_customView on CustomView {
  fields {
    id
    sortDirection
    sortSequence
  }
}

fragment useSourceFilter_data on RootQuery {
  leadSources {
    ...useSourceFilter_source
    ...SourceLabel_source
    id
    name
    iconName
  }
}

fragment useSourceFilter_source on LeadSource {
  iconName
}
*/

const node: ConcreteRequest = (function () {
    var v0 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "filter"
    } as any, v1 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "first"
    } as any, v2 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "status"
    } as any, v3 = {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "teamsFeature"
    } as any, v4 = {
        "kind": "Variable",
        "name": "filter",
        "variableName": "filter"
    } as any, v5 = {
        "kind": "Variable",
        "name": "first",
        "variableName": "first"
    } as any, v6 = {
        "kind": "Variable",
        "name": "status",
        "variableName": "status"
    } as any, v7 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "iconName",
        "storageKey": null
    } as any, v8 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
    } as any, v9 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v10 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "colorName",
        "storageKey": null
    } as any, v11 = [
        {
            "kind": "Literal",
            "name": "opaque",
            "value": false
        } as any
    ], v12 = {
        "alias": "legacyID",
        "args": (v11 /*: any*/),
        "kind": "ScalarField",
        "name": "id",
        "storageKey": "id(opaque:false)"
    } as any, v13 = [
        (v9 /*: any*/),
        (v12 /*: any*/),
        (v8 /*: any*/)
    ], v14 = [
        (v4 /*: any*/),
        (v5 /*: any*/),
        (v6 /*: any*/)
    ], v15 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
    } as any, v16 = [
        (v9 /*: any*/)
    ], v17 = {
        "alias": null,
        "args": null,
        "concreteType": "Filter",
        "kind": "LinkedField",
        "name": "filter",
        "plural": false,
        "selections": (v16 /*: any*/),
        "storageKey": null
    } as any, v18 = {
        "alias": "uuid",
        "args": (v11 /*: any*/),
        "kind": "ScalarField",
        "name": "id",
        "storageKey": "id(opaque:false)"
    } as any, v19 = [
        {
            "alias": "text",
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
        } as any
    ], v20 = [
        (v9 /*: any*/),
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "label",
            "storageKey": null
        } as any
    ], v21 = [
        (v8 /*: any*/),
        (v9 /*: any*/)
    ];
    return {
        "fragment": {
            "argumentDefinitions": [
                (v0 /*: any*/),
                (v1 /*: any*/),
                (v2 /*: any*/),
                (v3 /*: any*/)
            ],
            "kind": "Fragment",
            "metadata": null,
            "name": "LeadsListViewQuery",
            "selections": [
                {
                    "args": [
                        (v4 /*: any*/),
                        (v5 /*: any*/),
                        (v6 /*: any*/),
                        {
                            "kind": "Variable",
                            "name": "teamsFeature",
                            "variableName": "teamsFeature"
                        }
                    ],
                    "kind": "FragmentSpread",
                    "name": "Layout_data"
                }
            ],
            "type": "RootQuery",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": [
                (v1 /*: any*/),
                (v2 /*: any*/),
                (v0 /*: any*/),
                (v3 /*: any*/)
            ],
            "kind": "Operation",
            "name": "LeadsListViewQuery",
            "selections": [
                {
                    "alias": "inboxCount",
                    "args": [
                        {
                            "kind": "Literal",
                            "name": "page",
                            "value": "INBOX"
                        }
                    ],
                    "kind": "ScalarField",
                    "name": "leadsCount",
                    "storageKey": "leadsCount(page:\"INBOX\")"
                },
                {
                    "alias": "archivedCount",
                    "args": [
                        {
                            "kind": "Literal",
                            "name": "page",
                            "value": "ARCHIVE"
                        }
                    ],
                    "kind": "ScalarField",
                    "name": "leadsCount",
                    "storageKey": "leadsCount(page:\"ARCHIVE\")"
                },
                {
                    "alias": null,
                    "args": null,
                    "concreteType": "LeadSource",
                    "kind": "LinkedField",
                    "name": "leadSources",
                    "plural": true,
                    "selections": [
                        (v7 /*: any*/),
                        (v8 /*: any*/),
                        (v9 /*: any*/)
                    ],
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": null,
                    "concreteType": "Label",
                    "kind": "LinkedField",
                    "name": "labels",
                    "plural": true,
                    "selections": [
                        (v9 /*: any*/),
                        (v8 /*: any*/),
                        (v10 /*: any*/),
                        {
                            "alias": "legacyLabelID",
                            "args": (v11 /*: any*/),
                            "kind": "ScalarField",
                            "name": "id",
                            "storageKey": "id(opaque:false)"
                        }
                    ],
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "users",
                    "plural": true,
                    "selections": (v13 /*: any*/),
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
                        (v9 /*: any*/),
                        (v12 /*: any*/),
                        (v8 /*: any*/),
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
                                (v9 /*: any*/),
                                (v12 /*: any*/)
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
                                (v12 /*: any*/),
                                (v9 /*: any*/)
                            ],
                            "storageKey": null
                        }
                    ],
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": (v14 /*: any*/),
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
                                        (v15 /*: any*/),
                                        (v9 /*: any*/),
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
                                (v9 /*: any*/),
                                {
                                    "alias": "internalID",
                                    "args": (v11 /*: any*/),
                                    "kind": "ScalarField",
                                    "name": "id",
                                    "storageKey": "id(opaque:false)"
                                },
                                {
                                    "alias": "customViewId",
                                    "args": (v11 /*: any*/),
                                    "kind": "ScalarField",
                                    "name": "id",
                                    "storageKey": "id(opaque:false)"
                                },
                                (v17 /*: any*/)
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
                                        (v18 /*: any*/),
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Lead",
                                            "kind": "LinkedField",
                                            "name": "lead",
                                            "plural": false,
                                            "selections": [
                                                (v9 /*: any*/),
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "wasSeen",
                                                    "storageKey": null
                                                },
                                                (v18 /*: any*/),
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
                                                        (v9 /*: any*/)
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
                                                    "selections": (v16 /*: any*/),
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
                                                        (v15 /*: any*/),
                                                        {
                                                            "kind": "TypeDiscriminator",
                                                            "abstractKey": "__isField"
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v19 /*: any*/),
                                                            "type": "FieldText",
                                                            "abstractKey": null
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v19 /*: any*/),
                                                            "type": "FieldLargeText",
                                                            "abstractKey": null
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v19 /*: any*/),
                                                            "type": "FieldPhone",
                                                            "abstractKey": null
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v19 /*: any*/),
                                                            "type": "FieldAutocomplete",
                                                            "abstractKey": null
                                                        },
                                                        {
                                                            "kind": "InlineFragment",
                                                            "selections": (v19 /*: any*/),
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
                                                                        (v9 /*: any*/),
                                                                        (v8 /*: any*/),
                                                                        (v10 /*: any*/)
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
                                                                        (v7 /*: any*/),
                                                                        (v9 /*: any*/)
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
                                                                    "selections": (v20 /*: any*/),
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
                                                                    "selections": (v20 /*: any*/),
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
                                                                    "selections": (v21 /*: any*/),
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
                                                                    "selections": (v21 /*: any*/),
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
                                                                    "selections": (v21 /*: any*/),
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
                                                                                (v9 /*: any*/)
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
                                        (v9 /*: any*/),
                                        (v15 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "cursor",
                                    "storageKey": null
                                },
                                (v15 /*: any*/)
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
                        },
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "count",
                            "storageKey": null
                        },
                        {
                            "alias": "totalCount",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "count",
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "LeadActiveFilters",
                            "kind": "LinkedField",
                            "name": "activeFilters",
                            "plural": false,
                            "selections": [
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "LeadSource",
                                    "kind": "LinkedField",
                                    "name": "sources",
                                    "plural": true,
                                    "selections": (v16 /*: any*/),
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Label",
                                    "kind": "LinkedField",
                                    "name": "labels",
                                    "plural": true,
                                    "selections": (v16 /*: any*/),
                                    "storageKey": null
                                },
                                (v17 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "User",
                                    "kind": "LinkedField",
                                    "name": "owner",
                                    "plural": false,
                                    "selections": (v16 /*: any*/),
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "User",
                                    "kind": "LinkedField",
                                    "name": "user",
                                    "plural": false,
                                    "selections": (v16 /*: any*/),
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Team",
                                    "kind": "LinkedField",
                                    "name": "team",
                                    "plural": false,
                                    "selections": (v16 /*: any*/),
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
                    "args": (v14 /*: any*/),
                    "filters": [
                        "status",
                        "filter",
                        "sort"
                    ],
                    "handle": "connection",
                    "key": "ListView_leadView",
                    "kind": "LinkedHandle",
                    "name": "leadView"
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
                            "selections": (v13 /*: any*/),
                            "storageKey": null
                        }
                    ]
                }
            ]
        },
        "params": {
            "cacheID": "45548f8cbb4267bd9f2941853e6ceae5",
            "id": null,
            "metadata": {},
            "name": "LeadsListViewQuery",
            "operationKind": "query",
            "text": "query LeadsListViewQuery(\n  $first: Int!\n  $status: LeadStatus!\n  $filter: LeadsFilter\n  $teamsFeature: Boolean!\n) {\n  ...Layout_data_3pRY86\n}\n\nfragment ActionBarAddLead_data_1UP9LE on RootQuery {\n  ...SourceFilter_data\n  ...LabelsFilter_data\n  ...GlobalFilter_data_1UP9LE\n}\n\nfragment ActionBarAddLead_leadView on LeadTableConnection {\n  totalCount: count\n}\n\nfragment ActionBar_data_1UP9LE on RootQuery {\n  ...ActionBarAddLead_data_1UP9LE\n  inboxCount: leadsCount(page: INBOX)\n  archivedCount: leadsCount(page: ARCHIVE)\n}\n\nfragment ActionBar_leadView on LeadTableConnection {\n  ...ActionBarAddLead_leadView\n}\n\nfragment FieldActivity_data on Lead {\n  upcomingActivity {\n    dueDate\n    dueTime\n    type\n    id\n  }\n}\n\nfragment FieldComponent_field on Field {\n  __isField: __typename\n  __typename\n  ... on FieldText {\n    text: value\n  }\n  ... on FieldLargeText {\n    text: value\n  }\n  ... on FieldPhone {\n    text: value\n  }\n  ... on FieldAutocomplete {\n    text: value\n  }\n  ... on FieldAddress {\n    text: value\n  }\n  ... on FieldVisibility {\n    text: label\n  }\n  ... on FieldNumeric {\n    float: value\n  }\n  ... on FieldInteger {\n    number: value\n  }\n  ... on FieldDate {\n    ...FieldDate_data\n  }\n  ... on FieldDateRange {\n    ...FieldDateRange_data\n  }\n  ... on FieldDateTime {\n    ...FieldDateTime_data\n  }\n  ... on FieldTime {\n    ...FieldTime_data\n  }\n  ... on FieldTimeRange {\n    ...FieldTimeRange_data\n  }\n  ... on FieldLabels {\n    ...FieldLabels_data\n  }\n  ... on FieldLeadSource {\n    ...FieldSource_data\n  }\n  ... on FieldSingleOption {\n    selectedOption: selected {\n      id\n      label\n    }\n  }\n  ... on FieldMultipleOptions {\n    ...FieldMultipleOptions_data\n  }\n  ... on FieldUser {\n    user {\n      name\n      id\n    }\n  }\n  ... on FieldPerson {\n    person {\n      name\n      id\n    }\n  }\n  ... on FieldOrganization {\n    organization {\n      name\n      id\n    }\n  }\n  ... on FieldActivity {\n    __typename\n  }\n  ... on FieldMonetary {\n    ...FieldMonetary_data\n  }\n}\n\nfragment FieldComponent_lead on Lead {\n  wasSeen\n  ...FieldActivity_data\n}\n\nfragment FieldDateRange_data on FieldDateRange {\n  startDate: start\n  endDate: end\n}\n\nfragment FieldDateTime_data on FieldDateTime {\n  dateTime: value\n}\n\nfragment FieldDate_data on FieldDate {\n  date: value\n}\n\nfragment FieldLabels_data on FieldLabels {\n  labels {\n    id\n    name\n    colorName\n  }\n}\n\nfragment FieldMonetary_data on FieldMonetary {\n  monetary: value {\n    amount\n    currency {\n      code\n      id\n    }\n  }\n}\n\nfragment FieldMultipleOptions_data on FieldMultipleOptions {\n  selectedOptions: selected {\n    id\n    label\n  }\n}\n\nfragment FieldSource_data on FieldLeadSource {\n  leadSource {\n    name\n    iconName\n    id\n  }\n}\n\nfragment FieldTimeRange_data on FieldTimeRange {\n  startTime: start\n  endTime: end\n}\n\nfragment FieldTime_data on FieldTime {\n  time: value\n}\n\nfragment FilterInitializer_activeFilters on LeadActiveFilters {\n  sources {\n    id\n  }\n  labels {\n    id\n  }\n  filter {\n    id\n  }\n  owner {\n    id\n  }\n  user {\n    id\n  }\n  team {\n    id\n  }\n}\n\nfragment GlobalFilter_data_1UP9LE on RootQuery {\n  users {\n    id\n    legacyID: id(opaque: false)\n    name\n  }\n  teams @include(if: $teamsFeature) {\n    id\n    legacyID: id(opaque: false)\n    name\n  }\n  filters {\n    id\n    legacyID: id(opaque: false)\n    name\n    visibleTo\n    user {\n      id\n      legacyID: id(opaque: false)\n    }\n    customView {\n      legacyID: id(opaque: false)\n      id\n    }\n  }\n}\n\nfragment Label_label on Label {\n  colorName\n  name\n}\n\nfragment LabelsFilter_data on RootQuery {\n  labels {\n    ...LabelsSelectPopover_allLabels\n    ...Label_label\n    id\n    name\n  }\n}\n\nfragment LabelsSelectDeleteConfirm_label on Label {\n  legacyLabelID: id(opaque: false)\n}\n\nfragment LabelsSelectEdit_label on Label {\n  id\n  name\n  colorName\n  ...LabelsSelectDeleteConfirm_label\n}\n\nfragment LabelsSelectList_allLabels on Label {\n  id\n  name\n  ...LabelsSelectOption_label\n}\n\nfragment LabelsSelectOption_label on Label {\n  id\n  name\n  colorName\n}\n\nfragment LabelsSelectPopover_allLabels on Label {\n  id\n  ...LabelsSelectList_allLabels\n  ...LabelsSelectEdit_label\n}\n\nfragment LayoutHeader_data_1UP9LE on RootQuery {\n  ...ActionBar_data_1UP9LE\n}\n\nfragment LayoutHeader_leadView on LeadTableConnection {\n  ...ActionBar_leadView\n}\n\nfragment Layout_data_3pRY86 on RootQuery {\n  inboxCount: leadsCount(page: INBOX)\n  archivedCount: leadsCount(page: ARCHIVE)\n  ...LayoutHeader_data_1UP9LE\n  ...ListView_data_3nDyVa\n  leadView(first: $first, status: $status, filter: $filter) {\n    count\n    ...LayoutHeader_leadView\n    ...ListProvider_data\n    edges {\n      __typename\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment LeadCustomViewModal_customView on CustomView {\n  customViewId: id(opaque: false)\n  fields {\n    fieldDefinition {\n      entityType\n      key\n    }\n    width\n    sortDirection\n    sortSequence\n    id\n  }\n  filter {\n    id\n  }\n}\n\nfragment LeadDetailLoader_data on LeadTableConnection {\n  activeCustomView {\n    id\n  }\n  edges {\n    node {\n      lead {\n        id\n        uuid: id(opaque: false)\n        wasSeen\n      }\n      id\n    }\n  }\n}\n\nfragment ListProvider_data on LeadTableConnection {\n  count\n  activeCustomView {\n    ...useSortColumns_customView\n    id\n  }\n  activeFilters {\n    ...FilterInitializer_activeFilters\n  }\n}\n\nfragment ListViewContent_customView on CustomView {\n  id\n  internalID: id(opaque: false)\n  fields {\n    id\n    width\n    fieldDefinition {\n      name\n      entityType\n      key\n    }\n  }\n  ...LeadCustomViewModal_customView\n}\n\nfragment ListViewContent_rows on LeadTableRow {\n  uuid: id(opaque: false)\n  lead {\n    id\n    wasSeen\n    uuid: id(opaque: false)\n    isArchived\n    ...FieldComponent_lead\n  }\n  cells {\n    customViewField {\n      id\n    }\n    field {\n      __typename\n      ...FieldComponent_field\n    }\n  }\n}\n\nfragment ListView_data_3nDyVa on RootQuery {\n  leadView(first: $first, status: $status, filter: $filter) {\n    activeCustomView {\n      fields {\n        __typename\n        id\n      }\n      ...ListViewContent_customView\n      id\n    }\n    edges {\n      node {\n        ...ListViewContent_rows\n        id\n        __typename\n      }\n      cursor\n    }\n    ...LeadDetailLoader_data\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment SourceFilterContent_data on RootQuery {\n  ...useSourceFilter_data\n}\n\nfragment SourceFilter_data on RootQuery {\n  ...useSourceFilter_data\n  ...SourceFilterContent_data\n}\n\nfragment SourceLabel_source on LeadSource {\n  name\n  iconName\n}\n\nfragment useSortColumns_customView on CustomView {\n  fields {\n    id\n    sortDirection\n    sortSequence\n  }\n}\n\nfragment useSourceFilter_data on RootQuery {\n  leadSources {\n    ...useSourceFilter_source\n    ...SourceLabel_source\n    id\n    name\n    iconName\n  }\n}\n\nfragment useSourceFilter_source on LeadSource {\n  iconName\n}\n"
        }
    } as any;
})();
(node as any).hash = '909116209aa736fdcf3d976b3ce29f67';
export default node;
