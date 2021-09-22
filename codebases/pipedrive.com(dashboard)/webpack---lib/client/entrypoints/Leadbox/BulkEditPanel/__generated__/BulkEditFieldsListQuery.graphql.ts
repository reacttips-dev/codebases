/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type BulkEditFieldsListQueryVariables = {};
export type BulkEditFieldsListQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"BulkEditLabels_data">;
};
export type BulkEditFieldsListQuery = {
    readonly response: BulkEditFieldsListQueryResponse;
    readonly variables: BulkEditFieldsListQueryVariables;
};



/*
query BulkEditFieldsListQuery {
  ...BulkEditLabels_data
}

fragment BulkEditLabels_data on RootQuery {
  labels {
    id
    colorName
    name
  }
}
*/

const node: ConcreteRequest = {
    "fragment": {
        "argumentDefinitions": [],
        "kind": "Fragment",
        "metadata": null,
        "name": "BulkEditFieldsListQuery",
        "selections": [
            {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BulkEditLabels_data"
            }
        ],
        "type": "RootQuery",
        "abstractKey": null
    },
    "kind": "Request",
    "operation": {
        "argumentDefinitions": [],
        "kind": "Operation",
        "name": "BulkEditFieldsListQuery",
        "selections": [
            {
                "alias": null,
                "args": null,
                "concreteType": "Label",
                "kind": "LinkedField",
                "name": "labels",
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
                        "name": "colorName",
                        "storageKey": null
                    },
                    {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                    }
                ],
                "storageKey": null
            }
        ]
    },
    "params": {
        "cacheID": "c41905d53269647ae40998a326a028ba",
        "id": null,
        "metadata": {},
        "name": "BulkEditFieldsListQuery",
        "operationKind": "query",
        "text": "query BulkEditFieldsListQuery {\n  ...BulkEditLabels_data\n}\n\nfragment BulkEditLabels_data on RootQuery {\n  labels {\n    id\n    colorName\n    name\n  }\n}\n"
    }
} as any;
(node as any).hash = '7b1ae3e3269ecd7e494d9508ac557b78';
export default node;
