/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type bulkDeleted_tracking_data = {
    readonly changedRecordsCount: number | null;
    readonly " $refType": "bulkDeleted_tracking_data";
};
export type bulkDeleted_tracking_data$data = bulkDeleted_tracking_data;
export type bulkDeleted_tracking_data$key = {
    readonly " $data"?: bulkDeleted_tracking_data$data;
    readonly " $fragmentRefs": FragmentRefs<"bulkDeleted_tracking_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "bulkDeleted_tracking_data"
} as any;
(node as any).hash = 'f3291e2e99a3dc8172fc0ed36bfc72f5';
export default node;
