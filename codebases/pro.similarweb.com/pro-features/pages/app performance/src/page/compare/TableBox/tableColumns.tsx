import * as React from "react";
import CoreAppCell from "../../../../../../components/core cells/src/CoreAppCell/CoreAppCell";
import CoreNumberCell from "../../../../../../components/core cells/src/CoreNumberCell/CoreNumberCell";
import { ApoStyledCell, RankCell } from "./StyledComponents";

export const overallColumns = [
    {
        field: "title",
        cellComponent: ({ value, row, metadata }) => (
            <ApoStyledCell>
                <CoreAppCell
                    value={value}
                    row={row}
                    appInfo={row.tooltip}
                    store={row.tooltip.appStore}
                    bold={row.isLeader}
                    getExternalLink={metadata.links.externalApp}
                    onTrackExternalLink={metadata.tracks.externalApp}
                    getAssetsUrl={metadata.getAssetsUrl}
                />
            </ApoStyledCell>
        ),
    },
    {
        field: "rank",
        cellComponent: ({ value, row }) => (
            <RankCell>
                <CoreNumberCell value={value} bold={true} highlighted={row.isLeader} prefix="#" />
            </RankCell>
        ),
        width: 80,
    },
];

export const categoryColumns = [
    {
        field: "title",
        cellComponent: ({ value, row, metadata }) => (
            <ApoStyledCell>
                <CoreAppCell
                    value={value}
                    row={row}
                    appInfo={row.tooltip}
                    store={row.tooltip.appStore}
                    bold={row.isLeader}
                    getExternalLink={metadata.links.externalApp}
                    onTrackExternalLink={metadata.tracks.externalApp}
                    getAssetsUrl={metadata.getAssetsUrl}
                />
            </ApoStyledCell>
        ),
    },
    {
        field: "rank",
        cellComponent: ({ value, row }) => (
            <RankCell>
                <CoreNumberCell value={value} bold={true} highlighted={row.isLeader} prefix="#" />
            </RankCell>
        ),
        width: 80,
    },
];
