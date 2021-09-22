/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type EmailContactLabel = "HOME" | "OTHER" | "WORK" | "%future added value";
export type PhoneContactLabel = "HOME" | "MOBILE" | "OTHER" | "WORK" | "%future added value";
export type VisibleTo = "GLOBAL" | "PRIVATE" | "SHARED" | "SHARED_BELOW" | "%future added value";
export type UpdateLeadInput = {
    dealExpectedCloseDate?: string | null;
    dealValue?: MoneyInput | null;
    id: string;
    isArchived?: boolean | null;
    labelIds?: Array<string> | null;
    noOrganizationLink?: boolean | null;
    noPersonLink?: boolean | null;
    organization?: LeadOrganizationInput | null;
    ownerLegacyId?: number | null;
    person?: LeadPersonInput | null;
    title?: string | null;
    visibleTo?: VisibleTo | null;
    wasSeen?: boolean | null;
};
export type MoneyInput = {
    amount: string;
    currency: string;
};
export type LeadOrganizationInput = {
    address?: string | null;
    id?: string | null;
    name?: string | null;
};
export type LeadPersonInput = {
    email?: EmailInput | null;
    emails?: Array<EmailInput> | null;
    name?: string | null;
    phone?: PhoneInput | null;
    phones?: Array<PhoneInput> | null;
};
export type EmailInput = {
    label: EmailContactLabel;
    value: string;
};
export type PhoneInput = {
    label: PhoneContactLabel;
    value: string;
};
export type useArchiveLeadMutationVariables = {
    input: UpdateLeadInput;
    customViewId?: string | null;
};
export type useArchiveLeadMutationResponse = {
    readonly updateLeadForView: ({
        readonly __typename: "LeadTableRow";
        readonly id: string;
        readonly __typename: "LeadTableRow";
        readonly lead: {
            readonly __typename: string;
            readonly id: string;
            readonly isArchived: boolean | null;
            readonly isActive: boolean | null;
            readonly " $fragmentRefs": FragmentRefs<"leadArchivation_tracking_data">;
        } | null;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type useArchiveLeadMutation = {
    readonly response: useArchiveLeadMutationResponse;
    readonly variables: useArchiveLeadMutationVariables;
};



/*
mutation useArchiveLeadMutation(
  $input: UpdateLeadInput!
  $customViewId: ID
) {
  updateLeadForView(input: $input, customViewId: $customViewId) {
    __typename
    ... on LeadTableRow {
      id
      __typename
      lead {
        __typename
        id
        isArchived
        isActive
        ...leadArchivation_tracking_data
      }
    }
    ... on Error {
      __isError: __typename
      __typename
    }
  }
}

fragment getAppliedLabels on Lead {
  labels {
    legacyID: id(opaque: false)
    name
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

fragment leadArchivation_tracking_data on Lead {
  leadID: id(opaque: false)
  ...getSource
  labels {
    __typename
    id
  }
  person {
    ...hasPersonName
    ...hasPersonPhone
    ...hasPersonEmail
    id
  }
  organization {
    ...hasOrganizationAddress
    ...hasOrganizationName
    id
  }
  ...getAppliedLabels
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
        "name": "input"
    } as any, v2 = [
        {
            "kind": "Variable",
            "name": "customViewId",
            "variableName": "customViewId"
        } as any,
        {
            "kind": "Variable",
            "name": "input",
            "variableName": "input"
        } as any
    ], v3 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
    } as any, v4 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v5 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isArchived",
        "storageKey": null
    } as any, v6 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isActive",
        "storageKey": null
    } as any, v7 = [
        {
            "kind": "Literal",
            "name": "opaque",
            "value": false
        } as any
    ], v8 = {
        "alias": "leadID",
        "args": (v7 /*: any*/),
        "kind": "ScalarField",
        "name": "id",
        "storageKey": "id(opaque:false)"
    } as any, v9 = [
        (v3 /*: any*/)
    ], v10 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
    } as any, v11 = [
        (v10 /*: any*/)
    ], v12 = [
        {
            "kind": "Literal",
            "name": "first",
            "value": 1
        } as any
    ], v13 = {
        "alias": null,
        "args": (v12 /*: any*/),
        "concreteType": "PhoneContact",
        "kind": "LinkedField",
        "name": "phones",
        "plural": true,
        "selections": (v9 /*: any*/),
        "storageKey": "phones(first:1)"
    } as any, v14 = {
        "alias": null,
        "args": (v12 /*: any*/),
        "concreteType": "EmailContact",
        "kind": "LinkedField",
        "name": "emails",
        "plural": true,
        "selections": (v9 /*: any*/),
        "storageKey": "emails(first:1)"
    } as any, v15 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "address",
        "storageKey": null
    } as any, v16 = {
        "alias": "legacyID",
        "args": (v7 /*: any*/),
        "kind": "ScalarField",
        "name": "id",
        "storageKey": "id(opaque:false)"
    } as any;
    return {
        "fragment": {
            "argumentDefinitions": [
                (v0 /*: any*/),
                (v1 /*: any*/)
            ],
            "kind": "Fragment",
            "metadata": null,
            "name": "useArchiveLeadMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v2 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateLeadForView",
                    "plural": false,
                    "selections": [
                        (v3 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
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
                                        (v4 /*: any*/),
                                        (v5 /*: any*/),
                                        (v6 /*: any*/),
                                        {
                                            "kind": "InlineDataFragmentSpread",
                                            "name": "leadArchivation_tracking_data",
                                            "selections": [
                                                (v8 /*: any*/),
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "Label",
                                                    "kind": "LinkedField",
                                                    "name": "labels",
                                                    "plural": true,
                                                    "selections": (v9 /*: any*/),
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
                                                        {
                                                            "kind": "InlineDataFragmentSpread",
                                                            "name": "hasPersonName",
                                                            "selections": (v11 /*: any*/)
                                                        },
                                                        {
                                                            "kind": "InlineDataFragmentSpread",
                                                            "name": "hasPersonPhone",
                                                            "selections": [
                                                                (v13 /*: any*/)
                                                            ]
                                                        },
                                                        {
                                                            "kind": "InlineDataFragmentSpread",
                                                            "name": "hasPersonEmail",
                                                            "selections": [
                                                                (v14 /*: any*/)
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
                                                            "name": "hasOrganizationAddress",
                                                            "selections": [
                                                                (v15 /*: any*/)
                                                            ]
                                                        },
                                                        {
                                                            "kind": "InlineDataFragmentSpread",
                                                            "name": "hasOrganizationName",
                                                            "selections": (v11 /*: any*/)
                                                        }
                                                    ],
                                                    "storageKey": null
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
                                                                    "selections": (v11 /*: any*/),
                                                                    "storageKey": null
                                                                }
                                                            ],
                                                            "storageKey": null
                                                        }
                                                    ]
                                                },
                                                {
                                                    "kind": "InlineDataFragmentSpread",
                                                    "name": "getAppliedLabels",
                                                    "selections": [
                                                        {
                                                            "alias": null,
                                                            "args": null,
                                                            "concreteType": "Label",
                                                            "kind": "LinkedField",
                                                            "name": "labels",
                                                            "plural": true,
                                                            "selections": [
                                                                (v16 /*: any*/),
                                                                (v10 /*: any*/)
                                                            ],
                                                            "storageKey": null
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "storageKey": null
                                }
                            ],
                            "type": "LeadTableRow",
                            "abstractKey": null
                        }
                    ],
                    "storageKey": null
                }
            ],
            "type": "RootMutation",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": [
                (v1 /*: any*/),
                (v0 /*: any*/)
            ],
            "kind": "Operation",
            "name": "useArchiveLeadMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v2 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "updateLeadForView",
                    "plural": false,
                    "selections": [
                        (v3 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
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
                                        (v4 /*: any*/),
                                        (v5 /*: any*/),
                                        (v6 /*: any*/),
                                        (v8 /*: any*/),
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
                                                        (v10 /*: any*/),
                                                        (v4 /*: any*/)
                                                    ],
                                                    "storageKey": null
                                                }
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
                                                (v3 /*: any*/),
                                                (v4 /*: any*/),
                                                (v16 /*: any*/),
                                                (v10 /*: any*/)
                                            ],
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
                                                (v10 /*: any*/),
                                                (v13 /*: any*/),
                                                (v14 /*: any*/),
                                                (v4 /*: any*/)
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
                                                (v15 /*: any*/),
                                                (v10 /*: any*/),
                                                (v4 /*: any*/)
                                            ],
                                            "storageKey": null
                                        }
                                    ],
                                    "storageKey": null
                                }
                            ],
                            "type": "LeadTableRow",
                            "abstractKey": null
                        },
                        {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isError"
                        }
                    ],
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "ee21e829f5ba9e1166194e4b56d49911",
            "id": null,
            "metadata": {},
            "name": "useArchiveLeadMutation",
            "operationKind": "mutation",
            "text": "mutation useArchiveLeadMutation(\n  $input: UpdateLeadInput!\n  $customViewId: ID\n) {\n  updateLeadForView(input: $input, customViewId: $customViewId) {\n    __typename\n    ... on LeadTableRow {\n      id\n      __typename\n      lead {\n        __typename\n        id\n        isArchived\n        isActive\n        ...leadArchivation_tracking_data\n      }\n    }\n    ... on Error {\n      __isError: __typename\n      __typename\n    }\n  }\n}\n\nfragment getAppliedLabels on Lead {\n  labels {\n    legacyID: id(opaque: false)\n    name\n    id\n  }\n}\n\nfragment getSource on Lead {\n  sourceInfo {\n    source {\n      name\n      id\n    }\n  }\n}\n\nfragment hasOrganizationAddress on Organization {\n  address\n}\n\nfragment hasOrganizationName on Organization {\n  name\n}\n\nfragment hasPersonEmail on Person {\n  emails(first: 1) {\n    __typename\n  }\n}\n\nfragment hasPersonName on Person {\n  name\n}\n\nfragment hasPersonPhone on Person {\n  phones(first: 1) {\n    __typename\n  }\n}\n\nfragment leadArchivation_tracking_data on Lead {\n  leadID: id(opaque: false)\n  ...getSource\n  labels {\n    __typename\n    id\n  }\n  person {\n    ...hasPersonName\n    ...hasPersonPhone\n    ...hasPersonEmail\n    id\n  }\n  organization {\n    ...hasOrganizationAddress\n    ...hasOrganizationName\n    id\n  }\n  ...getAppliedLabels\n}\n"
        }
    } as any;
})();
(node as any).hash = 'b6e891c1e870aa6ebbcac7693a6f87af';
export default node;
