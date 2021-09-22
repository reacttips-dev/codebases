/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type useDeleteLeadMutationVariables = {
    leadID: string;
    customViewId?: string | null;
};
export type useDeleteLeadMutationResponse = {
    readonly deleteLeadForView: ({
        readonly id: string;
        readonly __typename: "LeadTableRow";
        readonly lead: {
            readonly __typename: string;
            readonly id: string;
            readonly isArchived: boolean | null;
            readonly isActive: boolean | null;
            readonly " $fragmentRefs": FragmentRefs<"leadDeletion_tracking">;
        } | null;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};
export type useDeleteLeadMutation = {
    readonly response: useDeleteLeadMutationResponse;
    readonly variables: useDeleteLeadMutationVariables;
};



/*
mutation useDeleteLeadMutation(
  $leadID: ID!
  $customViewId: ID
) {
  deleteLeadForView(id: $leadID, customViewId: $customViewId) {
    __typename
    ... on LeadTableRow {
      id
      __typename
      lead {
        __typename
        id
        isArchived
        isActive
        ...leadDeletion_tracking
      }
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

fragment leadDeletion_tracking on Lead {
  leadID: id(opaque: false)
  ...getSource
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
  labels {
    __typename
    id
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
        "name": "leadID"
    } as any, v2 = [
        {
            "kind": "Variable",
            "name": "customViewId",
            "variableName": "customViewId"
        } as any,
        {
            "kind": "Variable",
            "name": "id",
            "variableName": "leadID"
        } as any
    ], v3 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v4 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
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
    } as any, v9 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
    } as any, v10 = [
        (v9 /*: any*/)
    ], v11 = [
        {
            "kind": "Literal",
            "name": "first",
            "value": 1
        } as any
    ], v12 = [
        (v4 /*: any*/)
    ], v13 = {
        "alias": null,
        "args": (v11 /*: any*/),
        "concreteType": "PhoneContact",
        "kind": "LinkedField",
        "name": "phones",
        "plural": true,
        "selections": (v12 /*: any*/),
        "storageKey": "phones(first:1)"
    } as any, v14 = {
        "alias": null,
        "args": (v11 /*: any*/),
        "concreteType": "EmailContact",
        "kind": "LinkedField",
        "name": "emails",
        "plural": true,
        "selections": (v12 /*: any*/),
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
            "name": "useDeleteLeadMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v2 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "deleteLeadForView",
                    "plural": false,
                    "selections": [
                        {
                            "kind": "InlineFragment",
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
                                        (v4 /*: any*/),
                                        (v3 /*: any*/),
                                        (v5 /*: any*/),
                                        (v6 /*: any*/),
                                        {
                                            "kind": "InlineDataFragmentSpread",
                                            "name": "leadDeletion_tracking",
                                            "selections": [
                                                (v8 /*: any*/),
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
                                                            "selections": (v10 /*: any*/)
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
                                                            "selections": (v10 /*: any*/)
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
                                                    "selections": (v12 /*: any*/),
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
                                                                    "selections": (v10 /*: any*/),
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
                                                                (v9 /*: any*/)
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
            "name": "useDeleteLeadMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v2 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "deleteLeadForView",
                    "plural": false,
                    "selections": [
                        (v4 /*: any*/),
                        {
                            "kind": "InlineFragment",
                            "selections": [
                                (v3 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Lead",
                                    "kind": "LinkedField",
                                    "name": "lead",
                                    "plural": false,
                                    "selections": [
                                        (v4 /*: any*/),
                                        (v3 /*: any*/),
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
                                                        (v9 /*: any*/),
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
                                            "concreteType": "Person",
                                            "kind": "LinkedField",
                                            "name": "person",
                                            "plural": false,
                                            "selections": [
                                                (v9 /*: any*/),
                                                (v13 /*: any*/),
                                                (v14 /*: any*/),
                                                (v3 /*: any*/)
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
                                                (v9 /*: any*/),
                                                (v3 /*: any*/)
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
                                                (v16 /*: any*/),
                                                (v9 /*: any*/),
                                                (v3 /*: any*/),
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
                        }
                    ],
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "bd4c1388c4033fff207e76ad8352e83c",
            "id": null,
            "metadata": {},
            "name": "useDeleteLeadMutation",
            "operationKind": "mutation",
            "text": "mutation useDeleteLeadMutation(\n  $leadID: ID!\n  $customViewId: ID\n) {\n  deleteLeadForView(id: $leadID, customViewId: $customViewId) {\n    __typename\n    ... on LeadTableRow {\n      id\n      __typename\n      lead {\n        __typename\n        id\n        isArchived\n        isActive\n        ...leadDeletion_tracking\n      }\n    }\n  }\n}\n\nfragment getAppliedLabels on Lead {\n  labels {\n    legacyID: id(opaque: false)\n    name\n    id\n  }\n}\n\nfragment getSource on Lead {\n  sourceInfo {\n    source {\n      name\n      id\n    }\n  }\n}\n\nfragment hasOrganizationAddress on Organization {\n  address\n}\n\nfragment hasOrganizationName on Organization {\n  name\n}\n\nfragment hasPersonEmail on Person {\n  emails(first: 1) {\n    __typename\n  }\n}\n\nfragment hasPersonName on Person {\n  name\n}\n\nfragment hasPersonPhone on Person {\n  phones(first: 1) {\n    __typename\n  }\n}\n\nfragment leadDeletion_tracking on Lead {\n  leadID: id(opaque: false)\n  ...getSource\n  person {\n    ...hasPersonName\n    ...hasPersonPhone\n    ...hasPersonEmail\n    id\n  }\n  organization {\n    ...hasOrganizationAddress\n    ...hasOrganizationName\n    id\n  }\n  ...getAppliedLabels\n  labels {\n    __typename\n    id\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '41d5b3e50525e43871cbf56ab5194153';
export default node;
