/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type leadArchivation_tracking_data = {
    readonly leadID: string;
    readonly labels: ReadonlyArray<{
        readonly __typename: string;
    } | null> | null;
    readonly person: {
        readonly " $fragmentRefs": FragmentRefs<"hasPersonName" | "hasPersonPhone" | "hasPersonEmail">;
    } | null;
    readonly organization: {
        readonly " $fragmentRefs": FragmentRefs<"hasOrganizationAddress" | "hasOrganizationName">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"getSource" | "getAppliedLabels">;
    readonly " $refType": "leadArchivation_tracking_data";
};
export type leadArchivation_tracking_data$data = leadArchivation_tracking_data;
export type leadArchivation_tracking_data$key = {
    readonly " $data"?: leadArchivation_tracking_data$data;
    readonly " $fragmentRefs": FragmentRefs<"leadArchivation_tracking_data">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "leadArchivation_tracking_data"
} as any;
(node as any).hash = '412912a3a4d911106d7689d602268b09';
export default node;
