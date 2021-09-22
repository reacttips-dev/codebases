/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type labels_metrics_label_applied_lead = {
    readonly leadID: string;
    readonly " $refType": "labels_metrics_label_applied_lead";
};
export type labels_metrics_label_applied_lead$data = labels_metrics_label_applied_lead;
export type labels_metrics_label_applied_lead$key = {
    readonly " $data"?: labels_metrics_label_applied_lead$data;
    readonly " $fragmentRefs": FragmentRefs<"labels_metrics_label_applied_lead">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "labels_metrics_label_applied_lead"
} as any;
(node as any).hash = '340930a7986d4887820a0e02b5121d39';
export default node;
