/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type bulkArchived_tracking_data = {
    readonly changedRecordsCount: number | null;
    readonly " $refType": "bulkArchived_tracking_data";
};
export type bulkArchived_tracking_data$data = bulkArchived_tracking_data;
export type bulkArchived_tracking_data$key = {
    readonly " $data"?: bulkArchived_tracking_data$data;
    readonly " $fragmentRefs": FragmentRefs<"bulkArchived_tracking_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "bulkArchived_tracking_data"
} as any;
(node as any).hash = '5f9acff00935303056b87d558974e3db';
export default node;
