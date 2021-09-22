/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type useSubscriptionActivitySubscriptionVariables = {};
export type useSubscriptionActivitySubscriptionResponse = {
    readonly INTERNAL__webapp: {
        readonly activity: {
            readonly id: string;
            readonly lead: {
                readonly id: string;
            } | null;
            readonly " $fragmentRefs": FragmentRefs<"Activity_data">;
        };
    };
};
export type useSubscriptionActivitySubscription = {
    readonly response: useSubscriptionActivitySubscriptionResponse;
    readonly variables: useSubscriptionActivitySubscriptionVariables;
};



/*
subscription useSubscriptionActivitySubscription {
  INTERNAL__webapp {
    activity {
      id
      lead {
        id
      }
      ...Activity_data
    }
  }
}

fragment Actions_data on Activity {
  id
  legacyID: id(opaque: false)
  lead {
    id
  }
  isDone
}

fragment Activity_data on Activity {
  id
  subject
  isDone
  type
  userId
  note
  ...Actions_data
  ...DueDate_data
  ...activities_tracking_data
}

fragment DueDate_data on Activity {
  dueDate
  dueTime
  isDone
}

fragment activities_tracking_data on Activity {
  legacyID: id(opaque: false)
  subject
  isDone
  type
  dueTime
  lead {
    legacyID: id(opaque: false)
    id
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any, v1 = {
        "alias": "legacyID",
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
    } as any;
    return {
        "fragment": {
            "argumentDefinitions": [],
            "kind": "Fragment",
            "metadata": null,
            "name": "useSubscriptionActivitySubscription",
            "selections": [
                {
                    "alias": null,
                    "args": null,
                    "concreteType": "INTERNAL__webapp",
                    "kind": "LinkedField",
                    "name": "INTERNAL__webapp",
                    "plural": false,
                    "selections": [
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "Activity",
                            "kind": "LinkedField",
                            "name": "activity",
                            "plural": false,
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
                                        (v0 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                {
                                    "args": null,
                                    "kind": "FragmentSpread",
                                    "name": "Activity_data"
                                }
                            ],
                            "storageKey": null
                        }
                    ],
                    "storageKey": null
                }
            ],
            "type": "RootSubscription",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": [],
            "kind": "Operation",
            "name": "useSubscriptionActivitySubscription",
            "selections": [
                {
                    "alias": null,
                    "args": null,
                    "concreteType": "INTERNAL__webapp",
                    "kind": "LinkedField",
                    "name": "INTERNAL__webapp",
                    "plural": false,
                    "selections": [
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "Activity",
                            "kind": "LinkedField",
                            "name": "activity",
                            "plural": false,
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
                                        (v0 /*: any*/),
                                        (v1 /*: any*/)
                                    ],
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "subject",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isDone",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "type",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "userId",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "note",
                                    "storageKey": null
                                },
                                (v1 /*: any*/),
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
            "cacheID": "5a064f33c91277067479f56e456effab",
            "id": null,
            "metadata": {},
            "name": "useSubscriptionActivitySubscription",
            "operationKind": "subscription",
            "text": "subscription useSubscriptionActivitySubscription {\n  INTERNAL__webapp {\n    activity {\n      id\n      lead {\n        id\n      }\n      ...Activity_data\n    }\n  }\n}\n\nfragment Actions_data on Activity {\n  id\n  legacyID: id(opaque: false)\n  lead {\n    id\n  }\n  isDone\n}\n\nfragment Activity_data on Activity {\n  id\n  subject\n  isDone\n  type\n  userId\n  note\n  ...Actions_data\n  ...DueDate_data\n  ...activities_tracking_data\n}\n\nfragment DueDate_data on Activity {\n  dueDate\n  dueTime\n  isDone\n}\n\nfragment activities_tracking_data on Activity {\n  legacyID: id(opaque: false)\n  subject\n  isDone\n  type\n  dueTime\n  lead {\n    legacyID: id(opaque: false)\n    id\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = 'e49311096ddefdb7da4d85c277c8a25f';
export default node;
