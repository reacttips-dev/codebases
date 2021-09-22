/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type LabelColor = "BLUE" | "GRAY" | "GREEN" | "PURPLE" | "RED" | "YELLOW" | "%future added value";
export type FieldLabels_data = {
    readonly labels: ReadonlyArray<{
        readonly id: string;
        readonly name: string;
        readonly colorName: LabelColor | null;
    } | null> | null;
    readonly " $refType": "FieldLabels_data";
};
export type FieldLabels_data$data = FieldLabels_data;
export type FieldLabels_data$key = {
    readonly " $data"?: FieldLabels_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldLabels_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldLabels_data"
} as any;
(node as any).hash = '0e7eaa95100fa5e1e34484467906dbf5';
export default node;
