/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type VisibleTo = "GLOBAL" | "PRIVATE" | "SHARED" | "SHARED_BELOW" | "%future added value";
export type getDealPrefillData = {
    readonly internalID: string;
    readonly title: string | null;
    readonly owner: {
        readonly internalID: string;
    } | null;
    readonly person: {
        readonly internalID: string;
        readonly isLinkedToLead: boolean;
        readonly name: string | null;
    } | null;
    readonly organization: {
        readonly internalID: string;
        readonly isLinkedToLead: boolean;
        readonly name: string | null;
    } | null;
    readonly deal: ({
        readonly __typename: "DealInfo";
        readonly customFields: ReadonlyArray<{
            readonly " $fragmentRefs": FragmentRefs<"composeDealModalPrefillCustomFieldsReducer">;
        } | null> | null;
        readonly " $fragmentRefs": FragmentRefs<"getDealPrefillDataValue">;
    } | {
        readonly __typename: "PipedriveDeal";
        readonly internalID: string;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
    readonly visibleTo: VisibleTo | null;
    readonly " $refType": "getDealPrefillData";
};
export type getDealPrefillData$data = getDealPrefillData;
export type getDealPrefillData$key = {
    readonly " $data"?: getDealPrefillData$data;
    readonly " $fragmentRefs": FragmentRefs<"getDealPrefillData">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "getDealPrefillData"
} as any;
(node as any).hash = '0e71beeb267ff768215bcb75ddc4a582';
export default node;
