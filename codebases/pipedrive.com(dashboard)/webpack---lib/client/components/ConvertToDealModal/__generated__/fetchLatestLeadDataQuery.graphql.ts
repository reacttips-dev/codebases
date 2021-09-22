/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type fetchLatestLeadDataQueryVariables = {
    leadID: string;
};
export type fetchLatestLeadDataQueryResponse = {
    readonly leadRef: ({
        readonly __typename: "Lead";
        readonly " $fragmentRefs": FragmentRefs<"getDealPrefillData" | "getPersonPrefillData" | "getOrganizationPrefillData" | "getDealAddedTrackingData_lead">;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type fetchLatestLeadDataQuery = {
    readonly response: fetchLatestLeadDataQueryResponse;
    readonly variables: fetchLatestLeadDataQueryVariables;
};



/*
query fetchLatestLeadDataQuery(
  $leadID: ID!
) {
  leadRef: node(id: $leadID) {
    __typename
    ... on Lead {
      __typename
      ...getDealPrefillData
      ...getPersonPrefillData
      ...getOrganizationPrefillData
      ...getDealAddedTrackingData_lead
    }
    id
  }
}

fragment composeDealModalPrefillCustomFields on CustomField {
  __isCustomField: __typename
  __typename
  ... on CustomFieldAddress {
    address
  }
  ... on CustomFieldAutocomplete {
    value
  }
  ... on CustomFieldDate {
    date
  }
  ... on CustomFieldDateRange {
    dateStart: start
    dateEnd: end
  }
  ... on CustomFieldLargeText {
    text
  }
  ... on CustomFieldMonetary {
    moneyValue: value {
      amount
      currency {
        code
        id
      }
    }
  }
  ... on CustomFieldMultipleOptions {
    options {
      internalID: id(opaque: false)
      id
    }
  }
  ... on CustomFieldNumeric {
    number
  }
  ... on CustomFieldPhone {
    phone
  }
  ... on CustomFieldSingleOption {
    option {
      internalID: id(opaque: false)
      id
    }
  }
  ... on CustomFieldText {
    text
  }
  ... on CustomFieldTime {
    time
  }
  ... on CustomFieldTimeRange {
    timeStart: start
    timeEnd: end
  }
  ... on CustomFieldPerson {
    person {
      internalID: id(opaque: false)
      name
      id
    }
  }
  ... on CustomFieldOrganization {
    organization {
      internalID: id(opaque: false)
      name
      id
    }
  }
}

fragment composeDealModalPrefillCustomFieldsReducer on CustomField {
  __isCustomField: __typename
  internalID: id(opaque: false)
  ...composeDealModalPrefillCustomFields
}

fragment getAge on Lead {
  timeCreated
}

fragment getDealAddedTrackingData_lead on Lead {
  internalID: id(opaque: false)
  ...getAge
  ...getSource
  person {
    ...hasPersonName
    ...hasPersonPhone
    ...hasPersonEmail
    id
  }
  organization {
    ...hasOrganizationName
    ...hasOrganizationAddress
    id
  }
}

fragment getDealPrefillData on Lead {
  internalID: id(opaque: false)
  title
  owner {
    internalID: id(opaque: false)
    id
  }
  person {
    internalID: id(opaque: false)
    isLinkedToLead
    name
    id
  }
  organization {
    internalID: id(opaque: false)
    isLinkedToLead
    name
    id
  }
  deal {
    __typename
    ... on DealInfo {
      ...getDealPrefillDataValue
      customFields {
        __typename
        ...composeDealModalPrefillCustomFieldsReducer
        id
      }
    }
    ... on PipedriveDeal {
      internalID: id(opaque: false)
      id
    }
  }
  visibleTo
}

fragment getDealPrefillDataValue on DealInfo {
  value {
    amount
    currency {
      code
      id
    }
  }
}

fragment getOrganizationPrefillData on Lead {
  organization {
    address
    customFields {
      __typename
      ...composeDealModalPrefillCustomFieldsReducer
      id
    }
    id
  }
}

fragment getPersonPrefillData on Lead {
  person {
    emails(first: 1) {
      email
      label
    }
    phones(first: 1) {
      phone
      label
    }
    customFields {
      __typename
      ...composeDealModalPrefillCustomFieldsReducer
      id
    }
    id
  }
}

fragment getSource on Lead {
  sourceInfo {
    source {
      name
      id
    }
  }
}

fragment hasOrganizationAddress on Organization {
  address
}

fragment hasOrganizationName on Organization {
  name
}

fragment hasPersonEmail on Person {
  emails(first: 1) {
    __typename
  }
}

fragment hasPersonName on Person {
  name
}

fragment hasPersonPhone on Person {
  phones(first: 1) {
    __typename
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "leadID"
        } as any
    ], v1 = [
        {
            "kind": "Variable",
            "name": "id",
            "variableName": "leadID"
        } as any
    ], v2 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
    } as any, v3 = {
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
    } as any, v4 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
    } as any, v5 = [
        (v3 /*: any*/)
    ], v6 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isLinkedToLead",
        "storageKey": null
    } as any, v7 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
    } as any, v8 = [
        (v3 /*: any*/),
        (v6 /*: any*/),
        (v7 /*: any*/)
    ], v9 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "address",
        "storageKey": null
    } as any, v10 = [
        (v9 /*: any*/)
    ], v11 = {
        "kind": "InlineFragment",
        "selections": (v10 /*: any*/),
        "type": "CustomFieldAddress",
        "abstractKey": null
    } as any, v12 = {
        "kind": "InlineFragment",
        "selections": [
            {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "value",
                "storageKey": null
            }
        ],
        "type": "CustomFieldAutocomplete",
        "abstractKey": null
    } as any, v13 = {
        "kind": "InlineFragment",
        "selections": [
            {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "date",
                "storageKey": null
            }
        ],
        "type": "CustomFieldDate",
        "abstractKey": null
    } as any, v14 = {
        "kind": "InlineFragment",
        "selections": [
            {
                "alias": "dateStart",
                "args": null,
                "kind": "ScalarField",
                "name": "start",
                "storageKey": null
            },
            {
                "alias": "dateEnd",
                "args": null,
                "kind": "ScalarField",
                "name": "end",
                "storageKey": null
            }
        ],
        "type": "CustomFieldDateRange",
        "abstractKey": null
    } as any, v15 = [
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "text",
            "storageKey": null
        } as any
    ], v16 = {
        "kind": "InlineFragment",
        "selections": (v15 /*: any*/),
        "type": "CustomFieldLargeText",
        "abstractKey": null
    } as any, v17 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "amount",
        "storageKey": null
    } as any, v18 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "code",
        "storageKey": null
    } as any, v19 = [
        (v17 /*: any*/),
        {
            "alias": null,
            "args": null,
            "concreteType": "MoneyCurrency",
            "kind": "LinkedField",
            "name": "currency",
            "plural": false,
            "selections": [
                (v18 /*: any*/)
            ],
            "storageKey": null
        } as any
    ], v20 = {
        "kind": "InlineFragment",
        "selections": [
            {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "number",
                "storageKey": null
            }
        ],
        "type": "CustomFieldNumeric",
        "abstractKey": null
    } as any, v21 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "phone",
        "storageKey": null
    } as any, v22 = {
        "kind": "InlineFragment",
        "selections": [
            (v21 /*: any*/)
        ],
        "type": "CustomFieldPhone",
        "abstractKey": null
    } as any, v23 = {
        "kind": "InlineFragment",
        "selections": (v15 /*: any*/),
        "type": "CustomFieldText",
        "abstractKey": null
    } as any, v24 = {
        "kind": "InlineFragment",
        "selections": [
            {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "time",
                "storageKey": null
            }
        ],
        "type": "CustomFieldTime",
        "abstractKey": null
    } as any, v25 = {
        "kind": "InlineFragment",
        "selections": [
            {
                "alias": "timeStart",
                "args": null,
                "kind": "ScalarField",
                "name": "start",
                "storageKey": null
            },
            {
                "alias": "timeEnd",
                "args": null,
                "kind": "ScalarField",
                "name": "end",
                "storageKey": null
            }
        ],
        "type": "CustomFieldTimeRange",
        "abstractKey": null
    } as any, v26 = [
        (v3 /*: any*/),
        (v7 /*: any*/)
    ], v27 = {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "customFields",
        "plural": true,
        "selections": [
            {
                "kind": "InlineDataFragmentSpread",
                "name": "composeDealModalPrefillCustomFieldsReducer",
                "selections": [
                    (v3 /*: any*/),
                    {
                        "kind": "InlineDataFragmentSpread",
                        "name": "composeDealModalPrefillCustomFields",
                        "selections": [
                            (v2 /*: any*/),
                            (v11 /*: any*/),
                            (v12 /*: any*/),
                            (v13 /*: any*/),
                            (v14 /*: any*/),
                            (v16 /*: any*/),
                            {
                                "kind": "InlineFragment",
                                "selections": [
                                    {
                                        "alias": "moneyValue",
                                        "args": null,
                                        "concreteType": "Money",
                                        "kind": "LinkedField",
                                        "name": "value",
                                        "plural": false,
                                        "selections": (v19 /*: any*/),
                                        "storageKey": null
                                    }
                                ],
                                "type": "CustomFieldMonetary",
                                "abstractKey": null
                            },
                            {
                                "kind": "InlineFragment",
                                "selections": [
                                    {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "CustomFieldOption",
                                        "kind": "LinkedField",
                                        "name": "options",
                                        "plural": true,
                                        "selections": (v5 /*: any*/),
                                        "storageKey": null
                                    }
                                ],
                                "type": "CustomFieldMultipleOptions",
                                "abstractKey": null
                            },
                            (v20 /*: any*/),
                            (v22 /*: any*/),
                            {
                                "kind": "InlineFragment",
                                "selections": [
                                    {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "CustomFieldOption",
                                        "kind": "LinkedField",
                                        "name": "option",
                                        "plural": false,
                                        "selections": (v5 /*: any*/),
                                        "storageKey": null
                                    }
                                ],
                                "type": "CustomFieldSingleOption",
                                "abstractKey": null
                            },
                            (v23 /*: any*/),
                            (v24 /*: any*/),
                            (v25 /*: any*/),
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
                                        "selections": (v26 /*: any*/),
                                        "storageKey": null
                                    }
                                ],
                                "type": "CustomFieldPerson",
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
                                        "selections": (v26 /*: any*/),
                                        "storageKey": null
                                    }
                                ],
                                "type": "CustomFieldOrganization",
                                "abstractKey": null
                            }
                        ]
                    }
                ]
            }
        ],
        "storageKey": null
    } as any, v28 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "visibleTo",
        "storageKey": null
    } as any, v29 = [
        {
            "kind": "Literal",
            "name": "first",
            "value": 1
        } as any
    ], v30 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
        "storageKey": null
    } as any, v31 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "label",
        "storageKey": null
    } as any, v32 = [
        (v7 /*: any*/)
    ], v33 = [
        (v2 /*: any*/)
    ], v34 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "timeCreated",
        "storageKey": null
    } as any, v35 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v36 = [
        (v3 /*: any*/),
        (v35 /*: any*/)
    ], v37 = [
        (v17 /*: any*/),
        {
            "alias": null,
            "args": null,
            "concreteType": "MoneyCurrency",
            "kind": "LinkedField",
            "name": "currency",
            "plural": false,
            "selections": [
                (v18 /*: any*/),
                (v35 /*: any*/)
            ],
            "storageKey": null
        } as any
    ], v38 = [
        (v3 /*: any*/),
        (v7 /*: any*/),
        (v35 /*: any*/)
    ], v39 = {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "customFields",
        "plural": true,
        "selections": [
            (v2 /*: any*/),
            {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isCustomField"
            },
            (v3 /*: any*/),
            (v35 /*: any*/),
            (v11 /*: any*/),
            (v12 /*: any*/),
            (v13 /*: any*/),
            (v14 /*: any*/),
            (v16 /*: any*/),
            {
                "kind": "InlineFragment",
                "selections": [
                    {
                        "alias": "moneyValue",
                        "args": null,
                        "concreteType": "Money",
                        "kind": "LinkedField",
                        "name": "value",
                        "plural": false,
                        "selections": (v37 /*: any*/),
                        "storageKey": null
                    }
                ],
                "type": "CustomFieldMonetary",
                "abstractKey": null
            },
            {
                "kind": "InlineFragment",
                "selections": [
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "CustomFieldOption",
                        "kind": "LinkedField",
                        "name": "options",
                        "plural": true,
                        "selections": (v36 /*: any*/),
                        "storageKey": null
                    }
                ],
                "type": "CustomFieldMultipleOptions",
                "abstractKey": null
            },
            (v20 /*: any*/),
            (v22 /*: any*/),
            {
                "kind": "InlineFragment",
                "selections": [
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "CustomFieldOption",
                        "kind": "LinkedField",
                        "name": "option",
                        "plural": false,
                        "selections": (v36 /*: any*/),
                        "storageKey": null
                    }
                ],
                "type": "CustomFieldSingleOption",
                "abstractKey": null
            },
            (v23 /*: any*/),
            (v24 /*: any*/),
            (v25 /*: any*/),
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
                        "selections": (v38 /*: any*/),
                        "storageKey": null
                    }
                ],
                "type": "CustomFieldPerson",
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
                        "selections": (v38 /*: any*/),
                        "storageKey": null
                    }
                ],
                "type": "CustomFieldOrganization",
                "abstractKey": null
            }
        ],
        "storageKey": null
    } as any;
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "fetchLatestLeadDataQuery",
            "selections": [
                {
                    "alias": "leadRef",
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                (v2 /*: any*/),
                                {
                                    "kind": "InlineDataFragmentSpread",
                                    "name": "getDealPrefillData",
                                    "selections": [
                                        (v3 /*: any*/),
                                        (v4 /*: any*/),
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "User",
                                            "kind": "LinkedField",
                                            "name": "owner",
                                            "plural": false,
                                            "selections": (v5 /*: any*/),
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Person",
                                            "kind": "LinkedField",
                                            "name": "person",
                                            "plural": false,
                                            "selections": (v8 /*: any*/),
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Organization",
                                            "kind": "LinkedField",
                                            "name": "organization",
                                            "plural": false,
                                            "selections": (v8 /*: any*/),
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": null,
                                            "kind": "LinkedField",
                                            "name": "deal",
                                            "plural": false,
                                            "selections": [
                                                (v2 /*: any*/),
                                                {
                                                    "kind": "InlineFragment",
                                                    "selections": [
                                                        (v27 /*: any*/),
                                                        {
                                                            "kind": "InlineDataFragmentSpread",
                                                            "name": "getDealPrefillDataValue",
                                                            "selections": [
                                                                {
                                                                    "alias": null,
                                                                    "args": null,
                                                                    "concreteType": "Money",
                                                                    "kind": "LinkedField",
                                                                    "name": "value",
                                                                    "plural": false,
                                                                    "selections": (v19 /*: any*/),
                                                                    "storageKey": null
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    "type": "DealInfo",
                                                    "abstractKey": null
                                                },
                                                {
                                                    "kind": "InlineFragment",
                                                    "selections": (v5 /*: any*/),
                                                    "type": "PipedriveDeal",
                                                    "abstractKey": null
                                                }
                                            ],
                                            "storageKey": null
                                        },
                                        (v28 /*: any*/)
                                    ]
                                },
                                {
                                    "kind": "InlineDataFragmentSpread",
                                    "name": "getPersonPrefillData",
                                    "selections": [
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Person",
                                            "kind": "LinkedField",
                                            "name": "person",
                                            "plural": false,
                                            "selections": [
                                                {
                                                    "alias": null,
                                                    "args": (v29 /*: any*/),
                                                    "concreteType": "EmailContact",
                                                    "kind": "LinkedField",
                                                    "name": "emails",
                                                    "plural": true,
                                                    "selections": [
                                                        (v30 /*: any*/),
                                                        (v31 /*: any*/)
                                                    ],
                                                    "storageKey": "emails(first:1)"
                                                },
                                                {
                                                    "alias": null,
                                                    "args": (v29 /*: any*/),
                                                    "concreteType": "PhoneContact",
                                                    "kind": "LinkedField",
                                                    "name": "phones",
                                                    "plural": true,
                                                    "selections": [
                                                        (v21 /*: any*/),
                                                        (v31 /*: any*/)
                                                    ],
                                                    "storageKey": "phones(first:1)"
                                                },
                                                (v27 /*: any*/)
                                            ],
                                            "storageKey": null
                                        }
                                    ]
                                },
                                {
                                    "kind": "InlineDataFragmentSpread",
                                    "name": "getOrganizationPrefillData",
                                    "selections": [
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Organization",
                                            "kind": "LinkedField",
                                            "name": "organization",
                                            "plural": false,
                                            "selections": [
                                                (v9 /*: any*/),
                                                (v27 /*: any*/)
                                            ],
                                            "storageKey": null
                                        }
                                    ]
                                },
                                {
                                    "kind": "InlineDataFragmentSpread",
                                    "name": "getDealAddedTrackingData_lead",
                                    "selections": [
                                        (v3 /*: any*/),
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Person",
                                            "kind": "LinkedField",
                                            "name": "person",
                                            "plural": false,
                                            "selections": [
                                                {
                                                    "kind": "InlineDataFragmentSpread",
                                                    "name": "hasPersonName",
                                                    "selections": (v32 /*: any*/)
                                                },
                                                {
                                                    "kind": "InlineDataFragmentSpread",
                                                    "name": "hasPersonPhone",
                                                    "selections": [
                                                        {
                                                            "alias": null,
                                                            "args": (v29 /*: any*/),
                                                            "concreteType": "PhoneContact",
                                                            "kind": "LinkedField",
                                                            "name": "phones",
                                                            "plural": true,
                                                            "selections": (v33 /*: any*/),
                                                            "storageKey": "phones(first:1)"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "kind": "InlineDataFragmentSpread",
                                                    "name": "hasPersonEmail",
                                                    "selections": [
                                                        {
                                                            "alias": null,
                                                            "args": (v29 /*: any*/),
                                                            "concreteType": "EmailContact",
                                                            "kind": "LinkedField",
                                                            "name": "emails",
                                                            "plural": true,
                                                            "selections": (v33 /*: any*/),
                                                            "storageKey": "emails(first:1)"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Organization",
                                            "kind": "LinkedField",
                                            "name": "organization",
                                            "plural": false,
                                            "selections": [
                                                {
                                                    "kind": "InlineDataFragmentSpread",
                                                    "name": "hasOrganizationName",
                                                    "selections": (v32 /*: any*/)
                                                },
                                                {
                                                    "kind": "InlineDataFragmentSpread",
                                                    "name": "hasOrganizationAddress",
                                                    "selections": (v10 /*: any*/)
                                                }
                                            ],
                                            "storageKey": null
                                        },
                                        {
                                            "kind": "InlineDataFragmentSpread",
                                            "name": "getAge",
                                            "selections": [
                                                (v34 /*: any*/)
                                            ]
                                        },
                                        {
                                            "kind": "InlineDataFragmentSpread",
                                            "name": "getSource",
                                            "selections": [
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "SourceInfo",
                                                    "kind": "LinkedField",
                                                    "name": "sourceInfo",
                                                    "plural": false,
                                                    "selections": [
                                                        {
                                                            "alias": null,
                                                            "args": null,
                                                            "concreteType": "LeadSource",
                                                            "kind": "LinkedField",
                                                            "name": "source",
                                                            "plural": false,
                                                            "selections": (v32 /*: any*/),
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
                            "type": "Lead",
                            "abstractKey": null
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
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "fetchLatestLeadDataQuery",
            "selections": [
                {
                    "alias": "leadRef",
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/),
                        (v35 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                (v3 /*: any*/),
                                (v4 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "User",
                                    "kind": "LinkedField",
                                    "name": "owner",
                                    "plural": false,
                                    "selections": (v36 /*: any*/),
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Person",
                                    "kind": "LinkedField",
                                    "name": "person",
                                    "plural": false,
                                    "selections": [
                                        (v3 /*: any*/),
                                        (v6 /*: any*/),
                                        (v7 /*: any*/),
                                        (v35 /*: any*/),
                                        {
                                            "alias": null,
                                            "args": (v29 /*: any*/),
                                            "concreteType": "EmailContact",
                                            "kind": "LinkedField",
                                            "name": "emails",
                                            "plural": true,
                                            "selections": [
                                                (v30 /*: any*/),
                                                (v31 /*: any*/),
                                                (v2 /*: any*/)
                                            ],
                                            "storageKey": "emails(first:1)"
                                        },
                                        {
                                            "alias": null,
                                            "args": (v29 /*: any*/),
                                            "concreteType": "PhoneContact",
                                            "kind": "LinkedField",
                                            "name": "phones",
                                            "plural": true,
                                            "selections": [
                                                (v21 /*: any*/),
                                                (v31 /*: any*/),
                                                (v2 /*: any*/)
                                            ],
                                            "storageKey": "phones(first:1)"
                                        },
                                        (v39 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Organization",
                                    "kind": "LinkedField",
                                    "name": "organization",
                                    "plural": false,
                                    "selections": [
                                        (v3 /*: any*/),
                                        (v6 /*: any*/),
                                        (v7 /*: any*/),
                                        (v35 /*: any*/),
                                        (v9 /*: any*/),
                                        (v39 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "deal",
                                    "plural": false,
                                    "selections": [
                                        (v2 /*: any*/),
                                        {
                                            "kind": "InlineFragment",
                                            "selections": [
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "Money",
                                                    "kind": "LinkedField",
                                                    "name": "value",
                                                    "plural": false,
                                                    "selections": (v37 /*: any*/),
                                                    "storageKey": null
                                                },
                                                (v39 /*: any*/)
                                            ],
                                            "type": "DealInfo",
                                            "abstractKey": null
                                        },
                                        {
                                            "kind": "InlineFragment",
                                            "selections": (v36 /*: any*/),
                                            "type": "PipedriveDeal",
                                            "abstractKey": null
                                        }
                                    ],
                                    "storageKey": null
                                },
                                (v28 /*: any*/),
                                (v34 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "SourceInfo",
                                    "kind": "LinkedField",
                                    "name": "sourceInfo",
                                    "plural": false,
                                    "selections": [
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "LeadSource",
                                            "kind": "LinkedField",
                                            "name": "source",
                                            "plural": false,
                                            "selections": [
                                                (v7 /*: any*/),
                                                (v35 /*: any*/)
                                            ],
                                            "storageKey": null
                                        }
                                    ],
                                    "storageKey": null
                                }
                            ],
                            "type": "Lead",
                            "abstractKey": null
                        }
                    ],
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "b880ac1e0f8414b09bf206c4fbb3af41",
            "id": null,
            "metadata": {},
            "name": "fetchLatestLeadDataQuery",
            "operationKind": "query",
            "text": "query fetchLatestLeadDataQuery(\n  $leadID: ID!\n) {\n  leadRef: node(id: $leadID) {\n    __typename\n    ... on Lead {\n      __typename\n      ...getDealPrefillData\n      ...getPersonPrefillData\n      ...getOrganizationPrefillData\n      ...getDealAddedTrackingData_lead\n    }\n    id\n  }\n}\n\nfragment composeDealModalPrefillCustomFields on CustomField {\n  __isCustomField: __typename\n  __typename\n  ... on CustomFieldAddress {\n    address\n  }\n  ... on CustomFieldAutocomplete {\n    value\n  }\n  ... on CustomFieldDate {\n    date\n  }\n  ... on CustomFieldDateRange {\n    dateStart: start\n    dateEnd: end\n  }\n  ... on CustomFieldLargeText {\n    text\n  }\n  ... on CustomFieldMonetary {\n    moneyValue: value {\n      amount\n      currency {\n        code\n        id\n      }\n    }\n  }\n  ... on CustomFieldMultipleOptions {\n    options {\n      internalID: id(opaque: false)\n      id\n    }\n  }\n  ... on CustomFieldNumeric {\n    number\n  }\n  ... on CustomFieldPhone {\n    phone\n  }\n  ... on CustomFieldSingleOption {\n    option {\n      internalID: id(opaque: false)\n      id\n    }\n  }\n  ... on CustomFieldText {\n    text\n  }\n  ... on CustomFieldTime {\n    time\n  }\n  ... on CustomFieldTimeRange {\n    timeStart: start\n    timeEnd: end\n  }\n  ... on CustomFieldPerson {\n    person {\n      internalID: id(opaque: false)\n      name\n      id\n    }\n  }\n  ... on CustomFieldOrganization {\n    organization {\n      internalID: id(opaque: false)\n      name\n      id\n    }\n  }\n}\n\nfragment composeDealModalPrefillCustomFieldsReducer on CustomField {\n  __isCustomField: __typename\n  internalID: id(opaque: false)\n  ...composeDealModalPrefillCustomFields\n}\n\nfragment getAge on Lead {\n  timeCreated\n}\n\nfragment getDealAddedTrackingData_lead on Lead {\n  internalID: id(opaque: false)\n  ...getAge\n  ...getSource\n  person {\n    ...hasPersonName\n    ...hasPersonPhone\n    ...hasPersonEmail\n    id\n  }\n  organization {\n    ...hasOrganizationName\n    ...hasOrganizationAddress\n    id\n  }\n}\n\nfragment getDealPrefillData on Lead {\n  internalID: id(opaque: false)\n  title\n  owner {\n    internalID: id(opaque: false)\n    id\n  }\n  person {\n    internalID: id(opaque: false)\n    isLinkedToLead\n    name\n    id\n  }\n  organization {\n    internalID: id(opaque: false)\n    isLinkedToLead\n    name\n    id\n  }\n  deal {\n    __typename\n    ... on DealInfo {\n      ...getDealPrefillDataValue\n      customFields {\n        __typename\n        ...composeDealModalPrefillCustomFieldsReducer\n        id\n      }\n    }\n    ... on PipedriveDeal {\n      internalID: id(opaque: false)\n      id\n    }\n  }\n  visibleTo\n}\n\nfragment getDealPrefillDataValue on DealInfo {\n  value {\n    amount\n    currency {\n      code\n      id\n    }\n  }\n}\n\nfragment getOrganizationPrefillData on Lead {\n  organization {\n    address\n    customFields {\n      __typename\n      ...composeDealModalPrefillCustomFieldsReducer\n      id\n    }\n    id\n  }\n}\n\nfragment getPersonPrefillData on Lead {\n  person {\n    emails(first: 1) {\n      email\n      label\n    }\n    phones(first: 1) {\n      phone\n      label\n    }\n    customFields {\n      __typename\n      ...composeDealModalPrefillCustomFieldsReducer\n      id\n    }\n    id\n  }\n}\n\nfragment getSource on Lead {\n  sourceInfo {\n    source {\n      name\n      id\n    }\n  }\n}\n\nfragment hasOrganizationAddress on Organization {\n  address\n}\n\nfragment hasOrganizationName on Organization {\n  name\n}\n\nfragment hasPersonEmail on Person {\n  emails(first: 1) {\n    __typename\n  }\n}\n\nfragment hasPersonName on Person {\n  name\n}\n\nfragment hasPersonPhone on Person {\n  phones(first: 1) {\n    __typename\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '467d444e84f662bd3fd086c277635dc5';
export default node;
