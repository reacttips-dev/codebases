/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type FieldActivity_data = {
    readonly upcomingActivity: {
        readonly dueDate: string | null;
        readonly dueTime: string | null;
        readonly type: string | null;
    } | null;
    readonly " $refType": "FieldActivity_data";
};
export type FieldActivity_data$data = FieldActivity_data;
export type FieldActivity_data$key = {
    readonly " $data"?: FieldActivity_data$data;
    readonly " $fragmentRefs": FragmentRefs<"FieldActivity_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "FieldActivity_data"
} as any;
(node as any).hash = '81dd4a154db61076522cd2d0837a4c24';
export default node;
