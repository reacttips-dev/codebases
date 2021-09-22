import { colorsPalettes, colorsSets } from "@similarweb/styles";
import numeral from "numeral";
import React from "react";

import { ShareBar } from "@similarweb/ui-components/dist/share-bar";
import { getValue, IMetricMaxValues } from "services/arena/utils";
import { CoreWebsiteCell } from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import { ShareCompetitionCell } from "../../../components/React/Table/cells";
import { DefaultCellHeader } from "../../../components/React/Table/headerCells";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { i18nFilter, timeFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import { DeviceSplitColumn } from "./StyledComponents";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../scripts/common/services/swNavigator";
import { CoreStackedIconsCell } from "components/core cells/src/CoreStackedIconsCell/CoreStackedIconsCell";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

export const DESKTOP_COLOR = colorsSets.b1.toArray()[0];
export const MOBILE_COLOR = colorsSets.b1.toArray()[1];
export const DATA_KEY = {
    MobileWeb: "mobile",
    Desktop: "desktop",
};

const DEFAULT_SORT_DIRECTION = "desc";

const getCorrectCell = (competitionData, webSource) => {
    if (webSource === devicesTypes.TOTAL) {
        return <ShareCompetitionCell competitionData={competitionData} />;
    }
    if (webSource === devicesTypes.DESKTOP) {
        return <ShareCompetitionCell competitionData={competitionData.slice(0, 1)} />;
    }
    if (webSource === devicesTypes.MOBILE) {
        return <ShareCompetitionCell competitionData={competitionData.slice(1)} />;
    }
};

export function getColumns(
    webSource: string,
    { sortDirection, field: sortField },
    maxValues: IMetricMaxValues,
) {
    return [
        {
            field: "domain",
            fixed: true,
            sortable: webSource !== devicesTypes.TOTAL,
            type: "string",
            displayName: i18nFilter()("arena.strategic.engagement.table.searchTerm"),
            tooltip: i18nFilter()("arena.strategic.engagement.table.searchTerm.tooltip"),
            cellComponent: (props) => {
                const { row } = props;
                return props.row.domain ? (
                    <ComponentsProvider components={{ WebsiteTooltip }}>
                        <CoreWebsiteCell
                            icon={row.Favicon}
                            domain={row.domain}
                            internalLink={Injector.get<SwNavigator>("swNavigator").href(
                                "websites-worldwideOverview",
                                {
                                    key: row.domain,
                                    country: row.country,
                                    duration: row.duration,
                                    webSource: row.webSource,
                                    isWWW: row.includeSubDomains ? "*" : "-",
                                },
                            )}
                            externalLink={`http://${row.domain}`}
                            trackExternalLink={() =>
                                allTrackers.trackEvent(
                                    "external link",
                                    "click",
                                    `Engagement Metrics table`,
                                )
                            }
                            showGaIcon={row.showGAIcon}
                            isGaPrivate={row.isGAPrivate}
                        />
                    </ComponentsProvider>
                ) : (
                    <CoreStackedIconsCell icons={props.row.allDomainsIcons}>
                        {i18nFilter()("arena.strategic.engagement.table.averageTitle")}
                    </CoreStackedIconsCell>
                );
            },
            showTotalCount: false,
            width: 212,
        },
        {
            displayName: i18nFilter()("arena.strategic.engagement.table.deviceSplit"),
            tooltip: i18nFilter()("arena.strategic.engagement.table.deviceSplit.tooltip"),
            field: "deviceSplit",
            type: "double",
            sortable: false,
            cellComponent: ({ row, tableData, field }) => {
                const hasData =
                    (row.deviceSplit.desktop && !isNaN(row.deviceSplit.desktop)) ||
                    (row.deviceSplit.mobile && !isNaN(row.deviceSplit.mobile));
                let desktopValue;
                let mobileValue;
                let average;
                if (hasData) {
                    desktopValue = numeral(row.deviceSplit.desktop).format("0%");
                    mobileValue = numeral(row.deviceSplit.mobile).format("0%");
                    average = tableData[tableData.length - 1][field].desktop;
                }
                return hasData ? (
                    <DeviceSplitColumn>
                        {desktopValue}
                        <ShareBar
                            value={row.deviceSplit.desktop}
                            primaryColor={DESKTOP_COLOR}
                            secondaryColor={MOBILE_COLOR}
                            hideChangeValue={true}
                            hideValue={true}
                            verticalLineProps={{
                                bgColor: colorsPalettes.carbon[100],
                                left: average * 100,
                                top: -28,
                                height: 72,
                            }}
                        />
                        {mobileValue}
                    </DeviceSplitColumn>
                ) : (
                    "N/A"
                );
            },
            minWidth: 233,
        },
        {
            displayName: i18nFilter()("arena.strategic.engagement.table.visitDuration"),
            tooltip: i18nFilter()("arena.strategic.engagement.table.visitDuration.tooltip"),
            field: "visitDuration",
            type: "double",
            sortable: webSource !== devicesTypes.TOTAL,
            cellComponent: ({ row, tableData, field }) => {
                const max =
                    webSource === devicesTypes.TOTAL
                        ? Math.max(maxValues.visitDuration.mobile, maxValues.visitDuration.desktop)
                        : maxValues.visitDuration[DATA_KEY[webSource]];
                const format = max >= 3600 ? "hh:mm:ss" : "mm:ss";
                const competitionData = [
                    {
                        value: getValue(row.visitDuration.desktop, max),
                        color: DESKTOP_COLOR,
                        secondaryColor: "transparent",
                        formattedValue: timeFilter()(row.visitDuration.desktop, null),
                        leader: row.rawDesktop ? row.rawDesktop.AvgVisitDuration.IsLeader : false,
                        average: tableData[tableData.length - 1][field].desktop / max,
                    },
                    {
                        value: getValue(row.visitDuration.mobile, max),
                        color: MOBILE_COLOR,
                        secondaryColor: "transparent",
                        formattedValue: timeFilter()(row.visitDuration.mobile, null),
                        leader: row.rawMobile ? row.rawMobile.AvgVisitDuration.IsLeader : false,
                        average: tableData[tableData.length - 1][field].mobile / max,
                    },
                ];
                return getCorrectCell(competitionData, webSource);
            },
            width: 233,
        },
        {
            displayName: i18nFilter()("arena.strategic.engagement.table.pagesPerVisit"),
            tooltip: i18nFilter()("arena.strategic.engagement.table.pagesPerVisit.tooltip"),
            field: "pagesPerVisit",
            type: "double",
            sortable: webSource !== devicesTypes.TOTAL,
            cellComponent: ({ row, tableData, field }) => {
                const max =
                    webSource === devicesTypes.TOTAL
                        ? Math.max(maxValues.pagesPerVisit.mobile, maxValues.pagesPerVisit.desktop)
                        : maxValues.pagesPerVisit[DATA_KEY[webSource]];

                const competitionData = [
                    {
                        value: getValue(row.pagesPerVisit.desktop, max),
                        color: DESKTOP_COLOR,
                        secondaryColor: "transparent",
                        formattedValue: numeral(row.pagesPerVisit.desktop).format("0.00"),
                        leader: row.rawDesktop ? row.rawDesktop.PagesPerVisit.IsLeader : false,
                        average: tableData[tableData.length - 1][field].desktop / max,
                    },
                    {
                        value: getValue(row.pagesPerVisit.mobile, max),
                        color: MOBILE_COLOR,
                        secondaryColor: "transparent",
                        formattedValue: numeral(row.pagesPerVisit.mobile).format("0.00"),
                        leader: row.rawMobile ? row.rawMobile.PagesPerVisit.IsLeader : false,
                        average: tableData[tableData.length - 1][field].mobile / max,
                    },
                ];

                return getCorrectCell(competitionData, webSource);
            },
            width: 233,
        },
        {
            displayName: i18nFilter()("arena.strategic.engagement.table.bounceRate"),
            tooltip: i18nFilter()("arena.strategic.engagement.table.bounceRate.tooltip"),
            field: "bounceRate",
            type: "double",
            sortable: webSource !== devicesTypes.TOTAL,
            cellComponent: ({ row, tableData, field }) => {
                const max =
                    webSource === devicesTypes.TOTAL
                        ? Math.max(maxValues.bounceRate.mobile, maxValues.bounceRate.desktop)
                        : maxValues.bounceRate[DATA_KEY[webSource]];

                const competitionData = [
                    {
                        value: getValue(row.bounceRate.desktop, max),
                        color: DESKTOP_COLOR,
                        secondaryColor: "transparent",
                        formattedValue: numeral(row.bounceRate.desktop).format("0.0%"),
                        leader: row.rawDesktop ? row.rawDesktop.BounceRate.IsLeader : false,
                        average: tableData[tableData.length - 1][field].desktop / max,
                    },
                    {
                        value: getValue(row.bounceRate.mobile, max),
                        color: MOBILE_COLOR,
                        secondaryColor: "transparent",
                        formattedValue: numeral(row.bounceRate.mobile).format("0.0%"),
                        leader: row.rawMobile ? row.rawMobile.BounceRate.IsLeader : false,
                        average: tableData[tableData.length - 1][field].mobile / max,
                    },
                ];

                return getCorrectCell(competitionData, webSource);
            },
            width: 233,
        },
    ].map((col: any) => {
        const modified = {
            ...col,
            visible: true,
            isSorted: false,
            headerComponent: DefaultCellHeader,
            sortDirection: DEFAULT_SORT_DIRECTION,
        };

        if (col.sortable) {
            modified.isSorted = col.field === sortField;
            modified.sortDirection =
                col.field === sortField ? sortDirection : modified.sortDirection;
        }

        return modified;
    });
}
