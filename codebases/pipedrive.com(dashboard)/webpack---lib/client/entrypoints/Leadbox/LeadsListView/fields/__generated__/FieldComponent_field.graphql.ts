/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldComponent_field = {
    readonly __typename: "FieldText";
    readonly text: string | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldLargeText";
    readonly text: string | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldPhone";
    readonly text: string | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldAutocomplete";
    readonly text: string | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldAddress";
    readonly text: string | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldVisibility";
    readonly text: string | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldNumeric";
    readonly float: number | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldInteger";
    readonly number: number | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldDate";
    readonly " $fragmentRefs": FragmentRefs<"FieldDate_data">;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldDateRange";
    readonly " $fragmentRefs": FragmentRefs<"FieldDateRange_data">;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldDateTime";
    readonly " $fragmentRefs": FragmentRefs<"FieldDateTime_data">;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldTime";
    readonly " $fragmentRefs": FragmentRefs<"FieldTime_data">;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldTimeRange";
    readonly " $fragmentRefs": FragmentRefs<"FieldTimeRange_data">;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldLabels";
    readonly " $fragmentRefs": FragmentRefs<"FieldLabels_data">;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldLeadSource";
    readonly " $fragmentRefs": FragmentRefs<"FieldSource_data">;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldSingleOption";
    readonly selectedOption: {
        readonly id: string;
        readonly label: string | null;
    } | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldMultipleOptions";
    readonly " $fragmentRefs": FragmentRefs<"FieldMultipleOptions_data">;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldUser";
    readonly user: {
        readonly name: string | null;
    } | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldPerson";
    readonly person: {
        readonly name: string | null;
    } | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldOrganization";
    readonly organization: {
        readonly name: string | null;
    } | null;
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldActivity";
    readonly __typename: "FieldActivity";
    readonly " $refType": "FieldComponent_field";
} | {
    readonly __typename: "FieldMonetary";
    readonly " $fragmentRefs": FragmentRefs<"FieldMonetary_data">;
    readonly " $refType": "FieldComponent_field";
} | {
    /*This will never be '%other', but we need some
    value in case none of the concrete values match.*/
    readonly __typename: "%other";
    readonly " $refType": "FieldComponent_field";
};
export type FieldComponent_field$data = FieldComponent_field;
export type FieldComponent_field$key = {
    readonly " $data"?: FieldComponent_field$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldComponent_field">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldComponent_field"
} as any;
(node as any).hash = '764178cf7687a4a380838ba7e18d0b92';
export default node;
