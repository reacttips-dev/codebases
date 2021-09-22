/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type bulkUnarchived_tracking_data = {
    readonly changedRecordsCount: number | null;
    readonly " $refType": "bulkUnarchived_tracking_data";
};
export type bulkUnarchived_tracking_data$data = bulkUnarchived_tracking_data;
export type bulkUnarchived_tracking_data$key = {
    readonly " $data"?: bulkUnarchived_tracking_data$data;
    readonly " $fragmentRefs": FragmentRefs<"bulkUnarchived_tracking_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "bulkUnarchived_tracking_data"
} as any;
(node as any).hash = '1b281cc95431bf010f0518fff3218e28';
export default node;
