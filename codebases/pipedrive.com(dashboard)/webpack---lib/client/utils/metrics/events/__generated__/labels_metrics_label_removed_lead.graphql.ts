/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type labels_metrics_label_removed_lead = {
    readonly leadID: string;
    readonly " $refType": "labels_metrics_label_removed_lead";
};
export type labels_metrics_label_removed_lead$data = labels_metrics_label_removed_lead;
export type labels_metrics_label_removed_lead$key = {
    readonly " $data"?: labels_metrics_label_removed_lead$data;
    readonly " $fragmentRefs": FragmentRefs<"labels_metrics_label_removed_lead">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "labels_metrics_label_removed_lead"
} as any;
(node as any).hash = '8cdbc988da90a379f286bd8958d122b3';
export default node;
