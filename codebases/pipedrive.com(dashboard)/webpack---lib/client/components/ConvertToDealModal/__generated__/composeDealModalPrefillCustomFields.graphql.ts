/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type composeDealModalPrefillCustomFields = {
    readonly __typename: "CustomFieldAddress";
    readonly address: string | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldAutocomplete";
    readonly value: string | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldDate";
    readonly date: string | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldDateRange";
    readonly dateStart: string | null;
    readonly dateEnd: string | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldLargeText";
    readonly text: string | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldMonetary";
    readonly moneyValue: {
        readonly amount: string;
        readonly currency: {
            readonly code: string;
        };
    } | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldMultipleOptions";
    readonly options: ReadonlyArray<{
        readonly internalID: string;
    }> | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldNumeric";
    readonly number: number | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldPhone";
    readonly phone: string | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldSingleOption";
    readonly option: {
        readonly internalID: string;
    } | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldText";
    readonly text: string | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldTime";
    readonly time: string | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldTimeRange";
    readonly timeStart: string | null;
    readonly timeEnd: string | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldPerson";
    readonly person: {
        readonly internalID: string;
        readonly name: string | null;
    } | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    readonly __typename: "CustomFieldOrganization";
    readonly organization: {
        readonly internalID: string;
        readonly name: string | null;
    } | null;
    readonly " $refType": "composeDealModalPrefillCustomFields";
} | {
    /*This will never be '%other', but we need some
    value in case none of the concrete values match.*/
    readonly __typename: "%other";
    readonly " $refType": "composeDealModalPrefillCustomFields";
};
export type composeDealModalPrefillCustomFields$data = composeDealModalPrefillCustomFields;
export type composeDealModalPrefillCustomFields$key = {
    readonly " $data"?: composeDealModalPrefillCustomFields$data;
    readonly " $fragmentRefs": FragmentRefs<"composeDealModalPrefillCustomFields">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "composeDealModalPrefillCustomFields"
} as any;
(node as any).hash = 'a6eb06e1d5029255a6eaf41261be7ba0';
export default node;
