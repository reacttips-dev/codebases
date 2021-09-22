/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type SortDirection = "ASC" | "DESC" | "%future added value";
export type useSortColumns_customView = {
    readonly fields: ReadonlyArray<{
        readonly id: string;
        readonly sortDirection: SortDirection | null;
        readonly sortSequence: number | null;
    }> | null;
    readonly " $refType": "useSortColumns_customView";
};
export type useSortColumns_customView$data = useSortColumns_customView;
export type useSortColumns_customView$key = {
    readonly " $data"?: useSortColumns_customView$data;
    readonly " $fragmentRefs": FragmentRefs<"useSortColumns_customView">;
};



const node: ReaderInlineDataFragment = {
    "kind": "InlineDataFragment",
    "name": "useSortColumns_customView"
} as any;
(node as any).hash = 'c8a4c70ab1d908ededdf24e9c8721b90';
export default node;
