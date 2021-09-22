/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type EmailContactLabel = "HOME" | "OTHER" | "WORK" | "%future added value";
export type PhoneContactLabel = "HOME" | "MOBILE" | "OTHER" | "WORK" | "%future added value";
export type getPersonPrefillData = {
    readonly person: {
        readonly emails: ReadonlyArray<{
            readonly email: string | null;
            readonly label: EmailContactLabel | null;
        } | null> | null;
        readonly phones: ReadonlyArray<{
            readonly phone: string | null;
            readonly label: PhoneContactLabel | null;
        } | null> | null;
        readonly customFields: ReadonlyArray<{
            readonly " $fragmentRefs": FragmentRefs<"composeDealModalPrefillCustomFieldsReducer">;
        } | null> | null;
    } | null;
    readonly " $refType": "getPersonPrefillData";
};
export type getPersonPrefillData$data = getPersonPrefillData;
export type getPersonPrefillData$key = {
    readonly " $data"?: getPersonPrefillData$data;
    readonly " $fragmentRefs": FragmentRefs<"getPersonPrefillData">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "getPersonPrefillData"
} as any;
(node as any).hash = 'c3a40eea09f2b64ad01f1f4bfaeaf47c';
export default node;
