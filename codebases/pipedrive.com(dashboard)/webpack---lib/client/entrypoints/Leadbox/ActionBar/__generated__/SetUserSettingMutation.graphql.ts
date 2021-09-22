/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type UserSettingKey = "filter_leads_filter" | "filter_leads_label" | "filter_leads_source" | "%future added value";
export type SetUserSettingMutationVariables = {
    key: UserSettingKey;
    value?: string | null;
};
export type SetUserSettingMutationResponse = {
    readonly setUserSetting: {
        readonly userSetting?: {
            readonly id: string;
            readonly key: UserSettingKey;
            readonly value: string | null;
        } | null;
    } | null;
};
export type SetUserSettingMutation = {
    readonly response: SetUserSettingMutationResponse;
    readonly variables: SetUserSettingMutationVariables;
};



/*
mutation SetUserSettingMutation(
  $key: UserSettingKey!
  $value: String
) {
  setUserSetting(key: $key, value: $value) {
    __typename
    ... on GraphQLUserSettingResultData {
      userSetting {
        id
        key
        value
      }
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "key"
        } as any,
        {
            "defaultValue": null,
            "kind": "LocalArgument",
            "name": "value"
        } as any
    ], v1 = [
        {
            "kind": "Variable",
            "name": "key",
            "variableName": "key"
        } as any,
        {
            "kind": "Variable",
            "name": "value",
            "variableName": "value"
        } as any
    ], v2 = {
        "kind": "InlineFragment",
        "selections": [
            {
                "alias": null,
                "args": null,
                "concreteType": "UserSetting",
                "kind": "LinkedField",
                "name": "userSetting",
                "plural": false,
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
                        "name": "key",
                        "storageKey": null
                    },
                    {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "value",
                        "storageKey": null
                    }
                ],
                "storageKey": null
            }
        ],
        "type": "GraphQLUserSettingResultData",
        "abstractKey": null
    } as any;
    return {
        "fragment": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Fragment",
            "metadata": null,
            "name": "SetUserSettingMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "setUserSetting",
                    "plural": false,
                    "selections": [
                        (v2 /*: any*/)
                    ],
                    "storageKey": null
                }
            ],
            "type": "RootMutation",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": (v0 /*: any*/),
            "kind": "Operation",
            "name": "SetUserSettingMutation",
            "selections": [
                {
                    "alias": null,
                    "args": (v1 /*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "setUserSetting",
                    "plural": false,
                    "selections": [
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "__typename",
                            "storageKey": null
                        },
                        (v2 /*: any*/)
                    ],
                    "storageKey": null
                }
            ]
        },
        "params": {
            "cacheID": "916f079d385beb67c261fb48dd37faec",
            "id": null,
            "metadata": {},
            "name": "SetUserSettingMutation",
            "operationKind": "mutation",
            "text": "mutation SetUserSettingMutation(\n  $key: UserSettingKey!\n  $value: String\n) {\n  setUserSetting(key: $key, value: $value) {\n    __typename\n    ... on GraphQLUserSettingResultData {\n      userSetting {\n        id\n        key\n        value\n      }\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '90762e6e17a522007d61b7f213c2d90c';
export default node;
